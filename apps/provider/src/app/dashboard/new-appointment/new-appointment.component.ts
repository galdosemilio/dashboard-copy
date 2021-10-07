import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { ContextService, MeetingTypeWithColor } from '@app/service'
import { _ } from '@app/shared'
import { NotifierService } from '@coachcare/common/services'
import {
  AccountProvider,
  AccountTypeIds,
  AddMeetingRequest,
  MeetingAttendeeRequest,
  MeetingTimeslot,
  NamedEntity,
  OrganizationProvider,
  Schedule
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { isEqual } from 'lodash'
import * as moment from 'moment-timezone'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit, OnDestroy {
  public form: FormGroup

  public meetingTypes: MeetingTypeWithColor[] = []
  public durations = []
  public coaches: NamedEntity[] = []
  public timeSlots: MeetingTimeslot[] = []

  public now = moment()
  public selectedMeetingType: MeetingTypeWithColor
  public selectedDate = this.now
  public isLoading = false
  public selectedSlot: MeetingTimeslot = null

  get availableCoachesIds() {
    return this.coaches.filter((c) => c.id).map((c) => c.id)
  }

  constructor(
    private account: AccountProvider,
    private builder: FormBuilder,
    private context: ContextService,
    private notifier: NotifierService,
    private schedule: Schedule,
    private router: Router,
    private organization: OrganizationProvider
  ) {}

  ngOnInit() {
    this.meetingTypes = this.context.organization.meetingTypes
    this.createForm()
    this.getCoaches()
  }

  ngOnDestroy() {}

  private createForm(): void {
    this.form = this.builder.group({
      meetingType: [null, Validators.required],
      duration: [null, Validators.required],
      slot: [null, Validators.required],
      date: [this.now, Validators.required],
      providerId: ['']
    })

    this.listenChanges()
  }

  private async getCoaches(): Promise<void> {
    this.coaches = [
      {
        id: '',
        name: _('BOARD.ANY_AVAILABLE')
      }
    ]
    this.isLoading = true

    try {
      const res = await this.account.getList({
        organization: this.context.organizationId,
        accountType: AccountTypeIds.Provider,
        limit: 'all',
        strict: false
      })

      const newCoaches = res.data.map((provider) => ({
        id: provider.id,
        name: `${provider.firstName} ${provider.lastName}`
      }))

      if (newCoaches.length === 1) {
        this.coaches = newCoaches
      } else {
        this.coaches = this.coaches.concat(newCoaches)
      }
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.form.get('providerId').setValue(this.coaches[0].id)
      this.isLoading = false
    }
  }

  private listenChanges(): void {
    this.form.controls.meetingType.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((meetingType: MeetingTypeWithColor) => {
        this.meetingTypeChanged(meetingType)
      })

    this.form.controls.duration.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.getTimeSlots()
      })

    this.form.controls.date.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.getTimeSlots()
      })

    this.form.controls.providerId.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        this.getTimeSlots()
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
        accounts: value.providerId
          ? [value.providerId]
          : this.availableCoachesIds,
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

  private meetingTypeChanged(type: MeetingTypeWithColor): void {
    this.selectedMeetingType = type
    this.durations.length = 0
    if (type.durations.length) {
      type.durations.forEach((d) => {
        this.durations.push({
          value: moment.duration(d).asMinutes(),
          viewValue: moment.duration(d).humanize()
        })
      })
      this.form.get('duration').setValue(this.durations[0].value)
    }
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
      const meetingType = value.meetingType as MeetingTypeWithColor
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
        title: meetingType.description,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        meetingTypeId: meetingType.typeId.toString(),
        organizationId: this.context.organizationId,
        timezone: this.context.user.timezone
      }

      await this.schedule.addMeeting(newMeeting)
    } catch (err) {
      this.notifier.error(err)
    } finally {
      this.isLoading = false
      this.router.navigate(['/dashboard'])
      this.notifier.success(_('NOTIFY.SUCCESS.APPOINTMENT_BOOKED'))
    }
  }
}
