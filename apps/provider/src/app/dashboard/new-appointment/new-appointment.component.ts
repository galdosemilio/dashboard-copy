import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ContextService } from '@app/service'
import {
  Meeting,
  TranslationsObject,
  WELLCORE_PHASE_STATE_MAP,
  _
} from '@app/shared'
import { NotifierService } from '@coachcare/common/services'
import {
  AccountProvider,
  AccountTypeIds,
  AddMeetingRequest,
  AddressProvider,
  MeetingAttendeeRequest,
  MeetingTimeslot,
  NamedEntity,
  OrganizationProvider,
  PackageEnrollment,
  Schedule
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { isEqual, range } from 'lodash'
import * as moment from 'moment-timezone'
import { debounceTime } from 'rxjs/operators'
import { environment } from 'apps/provider/src/environments/environment'
import { TranslateService } from '@ngx-translate/core'
import { AddressLabelType } from '@coachcare/common/model'

@UntilDestroy()
@Component({
  selector: 'ccr-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss'],
  host: { class: 'wellcore-component' }
})
export class NewAppointmentComponent implements OnInit {
  public form: FormGroup
  public coaches: NamedEntity[] = []
  public timeSlots: MeetingTimeslot[] = []

  public afternoonSlots: MeetingTimeslot[] = []
  public eveningSlots: MeetingTimeslot[] = []
  public isLoading = false
  public maxDate
  public morningSlots: MeetingTimeslot[] = []
  public nightSlots: MeetingTimeslot[] = []
  public now: moment.Moment
  public selectedDate: moment.Moment
  public selectedSlot: MeetingTimeslot = null
  public selectedSlotAsMeeting: Meeting = null

  private blockedCalendarDates: string[] = []
  private i18n: TranslationsObject

  private get availableCoachesIds() {
    return this.coaches.filter((c) => c.id).map((c) => c.id)
  }

  private get _morningSlots() {
    return this.timeSlots.filter(
      (slot) =>
        moment(slot.slotStartTime.local).hour() >= 5 &&
        moment(slot.slotStartTime.local).hour() < 12
    )
  }

  private get _afternoonSlots() {
    return this.timeSlots.filter(
      (slot) =>
        moment(slot.slotStartTime.local).hour() >= 12 &&
        moment(slot.slotStartTime.local).hour() < 17
    )
  }

  private get _eveningSlots() {
    return this.timeSlots.filter(
      (slot) =>
        moment(slot.slotStartTime.local).hour() >= 17 &&
        moment(slot.slotStartTime.local).hour() < 22
    )
  }

  private get _nightSlots() {
    return this.timeSlots.filter(
      (slot) =>
        moment(slot.slotStartTime.local).hour() >= 22 ||
        moment(slot.slotStartTime.local).hour() < 5
    )
  }

  constructor(
    private account: AccountProvider,
    private addressProvider: AddressProvider,
    private builder: FormBuilder,
    private context: ContextService,
    private notifier: NotifierService,
    private schedule: Schedule,
    private packageEnrollment: PackageEnrollment,
    private translator: TranslateService,
    private router: Router,
    private organization: OrganizationProvider
  ) {
    this.calendarDateFilter = this.calendarDateFilter.bind(this)
  }

  public async ngOnInit(): Promise<void> {
    this.now = moment()
    this.selectedDate = this.now
    this.maxDate = this.now.clone().add(3, 'months')

    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.translate())

    this.createForm()
    await this.getCoaches()
    await this.resolveBlockedCalendarDates(this.now)
    this.onSelectDate(this.selectedDate)
  }

  public calendarDateFilter(date: moment.Moment): boolean {
    return !this.blockedCalendarDates.some((blockedEntry) =>
      moment(blockedEntry).isSame(date, 'day')
    )
  }

  public onMonthChange(date: moment.Moment): void {
    void this.resolveBlockedCalendarDates(date)
  }

  public onSelectDate(date: moment.Moment): void {
    this.selectedDate = date
    this.form.get('date').setValue(date)
  }

  public onSelectSlot(slot: MeetingTimeslot): void {
    if (isEqual(this.selectedSlot, slot)) {
      this.selectedSlot = null
      this.form.get('slot').setValue(null)
    } else {
      this.selectedSlot = slot
      this.selectedSlotAsMeeting = new Meeting({
        start: { utc: slot.slotStartTime.local },
        end: { utc: slot.slotStartTime.local }
      })
      this.form.get('slot').setValue(slot)
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return
    }

    this.isLoading = true

    try {
      const value = this.form.value
      const slot = value.slot as MeetingTimeslot

      const org = await this.organization.getSingle(this.context.organizationId)

      const location = org.address
        ? {
            streetAddress: org.address.street,
            city: org.address.city,
            state: org.address.state,
            postalCode: org.address.postalCode,
            country: org.address.country
          }
        : undefined

      const startTime = moment.tz(
        slot.slotStartTime.local,
        slot.slotStartTime.timezone
      )
      const endTime = startTime.clone().add(value.duration, 'minute')
      const coach = value.providerId || slot.accounts[0].id
      const attendees: MeetingAttendeeRequest[] = [
        {
          account: this.context.user.id
        },
        {
          account: coach
        }
      ]

      const newMeeting: AddMeetingRequest = {
        location,
        attendees,
        title: this.i18n['BOARD.WELLCORE_CONSULTATION'],
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        meetingTypeId: value.meetingType,
        organizationId: this.context.organizationId,
        timezone: this.context.user.timezone
      }

      await this.schedule.addMeeting(newMeeting)
      void this.router.navigate(['/dashboard'])
      this.notifier.success(_('NOTIFY.SUCCESS.APPOINTMENT_BOOKED'))
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private createForm(): void {
    this.form = this.builder.group({
      meetingType: [environment.wellcoreMeetingId, Validators.required],
      duration: [10, Validators.required],
      slot: [null, Validators.required],
      date: [this.now, Validators.required],
      providerId: ['']
    })

    this.listenChanges()
  }

  private async getCoaches(): Promise<void> {
    this.coaches = []
    this.isLoading = true

    try {
      const userAddressResponse = await this.addressProvider.getAddressList({
        account: this.context.user.id,
        limit: 'all'
      })

      const billingAddress = userAddressResponse.data.find((item) =>
        item.labels
          .map((label) => label.id.toString())
          .includes(AddressLabelType.BILLING)
      )

      const wellcoreStatePhaseEntry = Object.values(
        WELLCORE_PHASE_STATE_MAP
      ).find((entry) =>
        entry.states.includes(billingAddress?.stateProvince?.toLowerCase())
      )

      if (!wellcoreStatePhaseEntry) {
        return
      }

      const providersResponse = await this.account.getList({
        organization: this.context.organizationId,
        accountType: AccountTypeIds.Provider,
        limit: 'all',
        strict: false
      })

      const newCoaches = providersResponse.data.map((provider) => ({
        id: provider.id,
        name: `${provider.firstName} ${provider.lastName}`
      }))

      for (const coach of newCoaches) {
        const checkpackageEnrollmentResponse =
          await this.packageEnrollment.checkPackageEnrollment({
            organization: this.context.organizationId,
            account: coach.id,
            package:
              environment.selveraApiEnv === 'test'
                ? wellcoreStatePhaseEntry.testPhase
                : wellcoreStatePhaseEntry.prodPhase
          })

        if (checkpackageEnrollmentResponse.enrolled) {
          this.coaches.push(coach)
        }
      }
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
    }
  }

  private listenChanges(): void {
    this.form.controls.date.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        void this.getTimeSlots()
      })
  }

  private async getTimeSlots(): Promise<void> {
    const value = this.form.value

    if (!value.duration || !value.date) {
      return
    }

    try {
      this.timeSlots = []
      this.isLoading = true

      const response = await this.schedule.fetchOpenTimeslots({
        accounts: this.availableCoachesIds,
        duration: value.duration,
        start: value.date.startOf('day').toISOString(),
        end: value.date.clone().endOf('day').toISOString(),
        overlap: value.duration >= 30 ? 15 : undefined
      })

      const now = moment()
      this.timeSlots = response.data.filter((slot) =>
        moment
          .tz(slot.slotStartTime.local, slot.slotStartTime.timezone)
          .isSameOrAfter(now)
      )

      this.morningSlots = this._morningSlots
      this.afternoonSlots = this._afternoonSlots
      this.eveningSlots = this._eveningSlots
      this.nightSlots = this._nightSlots
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false

      const selectedSlot =
        value.startDateTime &&
        this.timeSlots.find(
          (slot) => slot.slotStartTime.utc === value.startDateTime
        )

      if (!selectedSlot) {
        this.form.get('slot').setValue(null)
        this.selectedSlot = null
      }
    }
  }

  private async resolveBlockedCalendarDates(
    date: moment.Moment
  ): Promise<void> {
    try {
      this.isLoading = true
      this.blockedCalendarDates = []

      const value = this.form.value
      const start = date.clone().startOf('month')
      const end = date.clone().endOf('month')

      const monthTimeslots = await this.schedule.fetchOpenTimeslots({
        accounts: this.availableCoachesIds,
        duration: value.duration,
        start: start.startOf('day').toISOString(),
        end: end.endOf('day').toISOString(),
        overlap: value.duration >= 30 ? 15 : undefined
      })

      const days = end.diff(start, 'days')

      this.blockedCalendarDates = range(0, days)
        .map((dayAmount) => start.clone().add(dayAmount, 'days').toISOString())
        .filter(
          (dateString) =>
            !monthTimeslots.data.some((entry) =>
              moment(entry.slotStartTime.local).isSame(dateString, 'day')
            )
        )
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
      this.maxDate = this.now.clone().add(3, 'months')
    }
  }

  private translate(): void {
    this.translator
      .get([_('BOARD.WELLCORE_CONSULTATION')])
      .subscribe((translations) => (this.i18n = translations))
  }
}
