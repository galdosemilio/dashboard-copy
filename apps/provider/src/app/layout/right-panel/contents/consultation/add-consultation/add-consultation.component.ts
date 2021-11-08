import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment-timezone'
import { Subscription } from 'rxjs'

import {
  ContextService,
  EventsService,
  MeetingTypeWithColor,
  NotifierService,
  ScheduleDataService
} from '@app/service'
import {
  _,
  FormUtils,
  PromptDialog,
  SelectOptions,
  SelectOption,
  Meeting
} from '@app/shared'
import {
  AccountAccessData,
  AccSingleResponse,
  AddAttendeeRequest,
  AddMeetingRequest,
  MeetingAttendee,
  OrganizationDetailed,
  OrganizationProvider
} from '@coachcare/sdk'
import { ConsultationFormArgs } from '../consultationFormArgs.interface'
import { AssociationsDatabase } from '@app/dashboard'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export type AddConsultationAttendee = MeetingAttendee & {
  accountType?: string
}

interface AttendeesOrganigation {
  [account: string]: Array<string>
}

@UntilDestroy()
@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddConsultationComponent implements OnDestroy, OnInit {
  form: FormGroup
  formSubmitted = false
  initialOrgOption: SelectOption<string>
  editing = 0
  clinicChangeSubscription: Subscription
  meetingTypeChangeSubscription: Subscription
  meetingTypesOk = true
  get now() {
    return moment()
  }

  clinicOptions: SelectOptions<string> = []
  clinics = []
  durations = []
  repeatOptions = [
    { value: 'never', viewValue: _('RIGHT_PANEL.NEVER') },
    { value: '1w', viewValue: _('RIGHT_PANEL.EVERY_WEEK') },
    { value: '2w', viewValue: _('RIGHT_PANEL.EVERY_OTHER_WEEK') },
    { value: '4w', viewValue: _('RIGHT_PANEL.EVERY_4_WEEKS') }
  ]
  endRepeatOptions = [
    { value: 'never', viewValue: _('RIGHT_PANEL.NEVER') },
    { value: 'after', viewValue: _('RIGHT_PANEL.AFTER') }
  ]
  meetingTypes: MeetingTypeWithColor[]
  searchCtrl: FormControl
  user: AccSingleResponse
  accounts: Array<AccountAccessData>
  attendees: Array<AddConsultationAttendee> = []
  addedAttendees: Array<AddConsultationAttendee> = []
  removedAttendees: Array<string> = []
  selectedMeetingType: MeetingTypeWithColor
  attendeeOrgs: AttendeesOrganigation = {}
  unaccessibleAttendees: Array<AddConsultationAttendee> = []
  isDisabledSubmit: boolean = false
  selectedOrg: OrganizationDetailed

  constructor(
    private builder: FormBuilder,
    private orgAssocDatabase: AssociationsDatabase,
    private org: OrganizationProvider,
    private dialog: MatDialog,
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private dataService: ScheduleDataService,
    public formUtils: FormUtils
  ) {}

  ngOnInit() {
    this.initForm()
    this.fetchOrganizations()

    this.user = this.context.user
    this.context.selected$.subscribe((user) => {
      if (user) {
        this.resetParticipants()
      }
    })

    this.bus.register(
      'right-panel.consultation.meeting',
      (args: ConsultationFormArgs) => {
        const exec = () => {
          this.editing = args.id ? args.id : 0
          args.id ? this.editForm(args.id) : this.initForm()
          this.bus.trigger(
            'right-panel.consultation.editing',
            args.id ? true : false
          )
        }
        this.form.dirty ? this.confirmDiscard(exec, args.form) : exec()
      }
    )
  }

  ngOnDestroy() {
    this.bus.unregister('right-panel.consultation.meeting')
    this.unlistenChanges()
  }

  initForm(): void {
    const initial = this.formUtils.getInitialDate()

    this.form = this.builder.group(
      {
        title: [null, Validators.required],
        date: initial,
        startTime: [initial, Validators.required],
        duration: [null, Validators.required],
        clinic: [null, Validators.required],
        meetingTypeId: [null, Validators.required],
        repeat: ['never', Validators.required],
        endRepeat: 'never',
        endAfter: null,
        allowConflictMeetings: false,
        location: this.builder.group(
          {
            streetAddress: null,
            city: null,
            state: null,
            postalCode: null,
            country: null
          },
          {
            validator: this.validateLocation
          }
        )
      },
      {
        validator: this.validateForm
      }
    )

    this.form.controls.meetingTypeId.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((meetingType) => {
        this.selectedMeetingType = meetingType
      })

    this.listenChanges()
  }

  listenChanges() {
    this.clinicChangeSubscription = this.form
      .get('clinic')
      .valueChanges.subscribe((c) => this.clinicChanged(c))

    this.meetingTypeChangeSubscription = this.form
      .get('meetingTypeId')
      .valueChanges.subscribe((type: MeetingTypeWithColor) =>
        this.meetingTypeChanged(type)
      )
  }

  unlistenChanges() {
    if (this.clinicChangeSubscription) {
      this.clinicChangeSubscription.unsubscribe()
      this.clinicChangeSubscription = null
    }
    if (this.meetingTypeChangeSubscription) {
      this.meetingTypeChangeSubscription.unsubscribe()
      this.meetingTypeChangeSubscription = null
    }
  }

  private async fetchOrganizations(): Promise<void> {
    try {
      this.clinics = (
        await this.orgAssocDatabase.fetch({
          account: this.context.user.id,
          limit: 'all'
        })
      ).data.map((clinic) => clinic.organization)

      this.clinicOptions = this.clinics.map((clinic) => ({
        value: clinic.id,
        viewValue: clinic.name
      }))

      if (!this.clinicOptions.length) {
        return
      }

      const contextClinic = this.clinicOptions.find(
        (clinic) => clinic.value === this.context.organizationId
      )

      this.initialOrgOption = contextClinic
        ? contextClinic
        : this.clinicOptions[0]
    } catch (error) {
      this.notifier.error(error)
    }
  }

  editForm(id) {
    // unsubscribe from events while setting the value
    this.unlistenChanges()

    // fetch the meeting and patch the form
    this.dataService
      .fetchMeeting(id)
      .then((meeting: Meeting) => {
        const clinic = this.clinics.find(
          (c) => c.value.shortcode === meeting.organization.shortCode
        )
        if (!clinic) {
          return this.notifier.error(_('NOTIFY.ERROR.CANNOT_EDIT_MEETING'))
        }
        const startTime = meeting.date
        const endTime = meeting.endDate
        const momentDuration = moment.duration(endTime.diff(startTime))
        let duration
        this.dataService
          .fetchMeetingTypes(clinic.value.id)
          .then((meetingTypes) => {
            this.meetingTypesOk = meetingTypes.length > 0
            // TODO include Google Calendar only for edition
            // (and hide date/duration? do not process them?)
            // TODO ML support i18n mapping the description
            this.meetingTypes = meetingTypes.filter(
              (t) => [4].indexOf(t.typeId) === -1
            )
            let meetingType
            if (meetingTypes.length) {
              meetingType = this.meetingTypes.find(
                (t) => +t.typeId === +meeting.type.id
              )
              if (meetingType) {
                this.durations.length = 0
                if (meetingType.durations.length) {
                  meetingType.durations.forEach((d) => {
                    this.durations.push({
                      value: d,
                      viewValue: moment.duration(d).humanize()
                    })
                  })
                  duration = this.durations.find(
                    (d) =>
                      moment.duration(d.value).humanize() ===
                      momentDuration.humanize()
                  )
                }
              }
            }

            this.form.patchValue({
              title: meeting.title,
              date: meeting.date,
              startTime: meeting.date,
              clinic: clinic.value,
              meetingTypeId: meetingType,
              duration: duration ? duration.value : null,
              location: {
                ...clinic.value.address,
                streetAddress: clinic.value.address.street
              }
            })

            this.attendees = meeting.attendees

            // subscribe to changes again
            this.listenChanges()
          })
          .catch(() =>
            this.notifier.error(_('NOTIFY.ERROR.RETRIEVING_MEETING_TYPES'))
          )
      })
      .catch((err) => this.notifier.error(err))
  }

  resetForm(): void {
    this.editing = 0
    this.formSubmitted = false
    // reset form
    const values = this.form.value
    this.initForm()
    this.form.patchValue({
      clinic: values.clinic,
      meetingTypeId: values.meetingTypeId
    })
    this.resetParticipants()
    // deactivate edition mode
    this.bus.trigger('schedule.table.selected', 0)
    this.bus.trigger('right-panel.consultation.editing', false)
  }

  validateForm(control: AbstractControl) {
    const startTime = control.get('startTime').value
    if (startTime) {
      if (startTime.isBefore(moment(), 'minutes')) {
        return { validateMeetingTime: _('NOTIFY.ERROR.DATE_SHOULD_BE_FUTURE') }
      } else {
        return null
      }
    }
  }

  validateLocation(control: AbstractControl) {
    const street = control.get('streetAddress').value
    const city = control.get('city').value
    const state = control.get('state').value
    const postalCode = control.get('postalCode').value
    if (street || city || state || postalCode) {
      if (street && city && state && postalCode) {
        return null
      } else {
        return { validateAddress: _('NOTIFY.ERROR.INCOMPLETE_ADDRESS') }
      }
    }
  }

  clinicChanged(org: OrganizationDetailed | null): void {
    if (!org) {
      this.form.get('location').reset()
      this.meetingTypes = []
      this.meetingTypesOk = true
      return
    }

    this.form.get('location').patchValue({
      ...org.address,
      streetAddress: org.address.street
    })
    this.dataService
      .fetchMeetingTypes(org.id)
      .then((res) => {
        this.meetingTypesOk = res.length > 0
        // TODO ML support i18n mapping the description
        this.meetingTypes = res.filter((t) => [4, 5].indexOf(t.typeId) === -1)
        if (res.length) {
          this.form.get('meetingTypeId').setValue(res[0])
        }
      })
      .catch(() =>
        this.notifier.error(_('NOTIFY.ERROR.RETRIEVING_MEETING_TYPES'))
      )

    this.selectedOrg = org
    this.checkAttendeesAccessbility()
  }

  meetingTypeChanged(type): void {
    this.durations.length = 0
    if (type.durations.length) {
      type.durations.forEach((d) => {
        this.durations.push({
          value: d,
          viewValue: moment.duration(d).humanize()
        })
      })
      this.form.get('duration').setValue(type.durations[0])
    }
  }

  addParticipant(account): void {
    const participantIds = this.attendees.map((a) => a.id)
    if (participantIds.indexOf(account.id) === -1) {
      const attendee: AddConsultationAttendee = {
        id: account.id,
        account: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        accountType: account.accountType
      }
      this.attendees.push(attendee)
      this.checkAttendeesAccessbility(attendee)

      if (this.editing) {
        if (!this.removedAttendees.some((id) => id === attendee.id)) {
          this.addedAttendees.push(attendee)
        } else {
          this.removedAttendees = this.removedAttendees.filter(
            (id) => id !== attendee.id
          )
        }
      }
    }
    this.accounts = []
  }

  removeParticipant(id: string): void {
    this.attendees = this.attendees.filter((a) => a.id !== id)

    if (this.editing) {
      if (!this.addedAttendees.some((a) => a.id === id)) {
        this.removedAttendees.push(id)
      } else {
        this.addedAttendees = this.addedAttendees.filter((a) => id !== a.id)
      }
    }

    this.checkAttendeesAccessbility()
  }

  resetParticipants(): void {
    this.attendees.length = 0
    this.addParticipant(this.context.selected)
  }

  repeatChanged(option): void {
    if (option === 'never') {
      this.form.get('endRepeat').reset('never')
      this.form.get('endAfter').reset(null)
      this.form.get('allowConflictMeetings').reset(false)
    }
  }

  endRepeatChanged(option): void {
    if (option === 'never') {
      this.form.get('endAfter').reset(null)
    }
  }

  confirmDiscard(callback, formName?) {
    if (this.form.dirty) {
      // prompt to discard changes
      this.dialog
        .open(PromptDialog, {
          data: {
            title: _('RIGHT_PANEL.DISCARD_CHANGES'),
            content: _('RIGHT_PANEL.CONFIRM_DISCARD_MEETING_CHANGES')
          }
        })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            callback()
          } else if (formName === 'editConsultation') {
            this.bus.trigger('schedule.table.selected', '')
          }
        })
    } else {
      callback()
    }
  }

  async onSubmit() {
    this.formSubmitted = true
    if (this.form.valid && this.attendees.length > 0) {
      try {
        const data = this.form.value

        const addMeetingRequest: AddMeetingRequest = {
          title: data.title,
          startTime: data.startTime.format(),
          endTime: moment(data.startTime)
            .add(moment.duration(data.duration))
            .format(),
          timezone: moment().tz(),
          meetingTypeId: data.meetingTypeId.typeId,
          organizationShortcode: data.clinic.shortcode,
          attendees: this.attendees.map((a) => {
            delete a.accountType
            return a
          })
        }

        if (data.location.streetAddress) {
          addMeetingRequest.location = data.location
        }
        if (data.repeat && data.repeat !== 'never') {
          if (data.endRepeat === 'never') {
            addMeetingRequest.recurring = {
              interval: data.repeat,
              endDate: moment(data.startTime).add(3, 'years').format()
            }
          } else {
            let endDate = moment(data.startTime)
            let days
            switch (data.repeat) {
              case '1w':
                days = data.endAfter * 7
                endDate = endDate.add(days, 'days')
                break
              case '2w':
                days = data.endAfter * 14
                endDate = endDate.add(days, 'days')
                break
              case '4w':
                days = data.endAfter * 28
                endDate = endDate.add(days, 'days')
                break
            }
            addMeetingRequest.recurring = {
              interval: data.repeat,
              endDate: endDate.format()
            }
          }

          addMeetingRequest.skipConflictCheck = !data.allowConflictMeetings
        }

        if (this.editing) {
          if (this.addedAttendees.length > 0) {
            for (const attendee of this.addedAttendees) {
              try {
                const addAttendeeRequest: AddAttendeeRequest = {
                  meetingId: this.editing.toString(),
                  attendees: [attendee]
                }
                await this.dataService.addAttendee(addAttendeeRequest)
              } catch (e) {
                await this.translator
                  .get([_('NOTIFY.ERROR.SCHEDULE_CONFLICT')], {
                    name: `${attendee.firstName} ${attendee.lastName}`
                  })
                  .subscribe((translations) => {
                    throw translations['NOTIFY.ERROR.SCHEDULE_CONFLICT']
                  })
              }
            }
          }

          for (const id of this.removedAttendees) {
            await this.dataService.deleteAttendee(this.editing.toString(), id)
          }
        }

        this.dataService
          .saveMeeting(addMeetingRequest, this.editing)
          .then((res) => {
            this.notifier.success(
              this.editing
                ? _('NOTIFY.SUCCESS.MEETING_UPDATED')
                : _('NOTIFY.SUCCESS.MEETING_ADDED')
            )
            this.bus.trigger('schedule.table.refresh')
            this.resetForm()
          })
          .catch((err) =>
            this.notifier.error(_('NOTIFY.ERROR.CANNOT_CREATE_MEETING'))
          )
      } catch (err) {
        this.notifier.error(err)
      }
    } else {
      this.formUtils.markAsTouched(this.form)
      this.form.updateValueAndValidity()
    }
  }

  onCancel() {
    this.confirmDiscard(() => {
      // deactivate edit mode
      this.resetForm()
    })
  }

  public onClinicSelect(option: SelectOption<string>): void {
    if (!option) {
      this.form.get('clinic').setValue(null)
      return
    }

    const foundClinic = this.clinics.find(
      (clinic) => clinic.id === option.value
    )

    if (!foundClinic) {
      return
    }

    this.form.get('clinic').setValue(foundClinic)
  }

  private async checkAttendeesAccessbility(
    newAttendee?: AddConsultationAttendee
  ): Promise<void> {
    if (newAttendee && !this.attendeeOrgs[newAttendee.id]) {
      try {
        this.isDisabledSubmit = true
        const orgs = await this.org.getAccessibleList({
          account: newAttendee.id,
          status: 'active',
          strict: false,
          limit: 'all'
        })

        this.attendeeOrgs[newAttendee.id] = orgs.data.map(
          (org) => org.organization.id
        )
      } catch (err) {
        this.notifier.error(err)
      } finally {
        this.isDisabledSubmit = false
      }
    }

    this.unaccessibleAttendees = []

    if (!this.selectedOrg) {
      return
    }

    this.unaccessibleAttendees = this.attendees.filter(
      (attendee) =>
        !this.attendeeOrgs[attendee.id]?.some((orgId) =>
          this.selectedOrg.hierarchyPath
            .map((hierarchy) => hierarchy.toString())
            .includes(orgId)
        )
    )

    this.isDisabledSubmit = this.unaccessibleAttendees.length > 0
  }
}
