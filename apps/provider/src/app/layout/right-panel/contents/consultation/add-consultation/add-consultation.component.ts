import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import { MatAutocompleteTrigger, MatDialog } from '@coachcare/common/material'
import { TranslateService } from '@ngx-translate/core'
import { find } from 'lodash'
import * as moment from 'moment-timezone'
import { Subscription } from 'rxjs'
import { Account } from '@coachcare/npm-api'

import { Meeting } from '@app/dashboard/schedule/models'
import { ScheduleDataService } from '@app/layout/right-panel/services'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { _, FormUtils, PromptDialog, TranslationsObject } from '@app/shared'
import {
  AccountAccessData,
  AccSingleResponse,
  AddAttendeeRequest,
  AddMeetingRequest,
  FetchMeetingTypesResponse,
  MeetingAttendee,
  OrganizationDetailed
} from '@coachcare/npm-api'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { ConsultationFormArgs } from '../consultationFormArgs.interface'

export type AddConsultationAttendee = MeetingAttendee & {
  accountType?: string
}

@Component({
  selector: 'app-add-consultation',
  templateUrl: './add-consultation.component.html',
  styleUrls: ['./add-consultation.component.scss']
})
export class AddConsultationComponent implements OnDestroy, OnInit {
  form: FormGroup
  formSubmitted = false
  translations: TranslationsObject
  editing = 0
  clinicChangeSubscription: Subscription
  meetingTypeChangeSubscription: Subscription
  meetingTypesOk = true
  get now() {
    return moment()
  }

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
  meetingTypes: FetchMeetingTypesResponse[]
  searchCtrl: FormControl
  user: AccSingleResponse
  accounts: Array<AccountAccessData>
  attendees: Array<AddConsultationAttendee> = []
  addedAttendees: Array<AddConsultationAttendee> = []
  removedAttendees: Array<string> = []

  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  constructor(
    private builder: FormBuilder,
    private dialog: MatDialog,
    private translator: TranslateService,
    private account: Account,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private dataService: ScheduleDataService,
    public formUtils: FormUtils
  ) {}

  ngOnInit() {
    this.initForm()
    this.initTranslations()
    this.getClinics()
    this.setupAutocomplete()

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

  initTranslations() {
    this.translator
      .get([_('GLOBAL.COACH'), _('GLOBAL.PATIENT')])
      .subscribe((translations) => (this.translations = translations))
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

    this.listenChanges()
  }

  listenChanges() {
    this.clinicChangeSubscription = this.form
      .get('clinic')
      .valueChanges.subscribe((c) => this.clinicChanged(c))

    this.meetingTypeChangeSubscription = this.form
      .get('meetingTypeId')
      .valueChanges.subscribe((type: FetchMeetingTypesResponse) =>
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

  getClinics(): void {
    this.clinics = this.context.organizations
      .filter((c) => c.id)
      .map((c) => ({
        value: c,
        viewValue: c.name
      }))
    if (this.clinics.length) {
      const clinic = this.context.organizationId
        ? find(this.clinics, ['value', { id: this.context.organizationId }])
        : this.clinics[0]

      this.form.get('clinic').setValue(clinic.value)
    }
  }

  clinicChanged(org: OrganizationDetailed): void {
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

  setupAutocomplete(): void {
    this.searchCtrl = new FormControl()
    this.searchCtrl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((query) => {
        if (query) {
          this.searchAccounts(query)
        } else {
          this.trigger.closePanel()
        }
      })
  }

  searchAccounts(query: string): void {
    this.account
      .getList({ query })
      .then((res) => {
        this.accounts = res.data.filter(
          (a) => !this.attendees.some((sa) => sa.id === a.id)
        )
        if (this.accounts.length > 0) {
          this.trigger.openPanel()
        }
      })
      .catch((err) => this.notifier.error(err))
  }

  formatAccountType(accountType) {
    let result
    if ([2, '2', 'provider'].indexOf(accountType) >= 0) {
      result = this.translations['GLOBAL.COACH']
    } else if ([3, '3', 'client'].indexOf(accountType) >= 0) {
      result = this.translations['GLOBAL.PATIENT']
    }
    return result ? result : ''
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
  }

  resetParticipants(): void {
    this.attendees.length = 0
    this.addParticipant(this.context.selected)
  }

  repeatChanged(option): void {
    if (option === 'never') {
      this.form.get('endRepeat').reset('never')
      this.form.get('endAfter').reset(null)
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
}
