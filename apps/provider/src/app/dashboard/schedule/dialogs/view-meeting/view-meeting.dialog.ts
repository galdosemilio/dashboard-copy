import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms'
import {
  MAT_DIALOG_DATA,
  MatAutocompleteTrigger,
  MatDialogRef
} from '@coachcare/common/material'
import { Router } from '@angular/router'
import { AddConsultationAttendee } from '@app/layout/right-panel/contents/consultation/add-consultation/add-consultation.component'
import { ScheduleDataService } from '@app/layout/right-panel/services'
import {
  ContextService,
  CurrentAccount,
  EventsService,
  NotifierService
} from '@app/service'
import { _, FormUtils } from '@app/shared'
import {
  AccountAccessData,
  AccSingleResponse,
  AddAttendeeRequest,
  AddMeetingRequest,
  AttendanceStatusEntry,
  FetchMeetingTypesResponse,
  UpdateAttendanceRequest
} from '@coachcare/npm-api'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { Account, Organization, Schedule } from 'selvera-api'
import { Meeting } from '../../models'

type ViewMeetingDialogEditMode = 'single' | 'recurring'

@Component({
  selector: 'app-view-meeting-dialog',
  templateUrl: './view-meeting.dialog.html',
  styleUrls: ['./view-meeting.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class ViewMeetingDialog implements OnDestroy, OnInit {
  @ViewChild(MatAutocompleteTrigger, { static: false })
  trigger: MatAutocompleteTrigger

  accounts: AccountAccessData[]
  addedAttendees: any[] = []
  attendees: any[] = []
  currentAccount: CurrentAccount
  deleteRecurringForm: FormGroup
  durations: any[] = []
  editMode: ViewMeetingDialogEditMode = 'single'
  endRepeatOptions = [
    { value: 'never', viewValue: _('RIGHT_PANEL.NEVER') },
    { value: 'after', viewValue: _('RIGHT_PANEL.AFTER') }
  ]
  attendanceOptions = [
    { value: true, viewValue: _('BOARD.SCHEDULE_ATTENDANCE_ATTENDED') },
    { value: false, viewValue: _('BOARD.SCHEDULE_ATTENDANCE_NOT_ATTENDED') }
  ]
  form: FormGroup
  isFuture = false
  isLoading = false
  meeting: Meeting
  meetingDuration: string
  meetingTypes: FetchMeetingTypesResponse[] = []
  removedAttendees: any[] = []
  repeatOptions = [
    { value: 'never', viewValue: _('RIGHT_PANEL.NEVER') },
    { value: '1w', viewValue: _('RIGHT_PANEL.EVERY_WEEK') },
    { value: '2w', viewValue: _('RIGHT_PANEL.EVERY_OTHER_WEEK') },
    { value: '4w', viewValue: _('RIGHT_PANEL.EVERY_4_WEEKS') }
  ]
  searchCtrl: FormControl
  state:
    | 'view'
    | 'edit'
    | 'edit_exit_confirm'
    | 'edit_mode_select'
    | 'delete'
    | 'delete-recurring' = 'view'
  today: moment.Moment = moment().startOf('day')
  translations: any

  constructor(
    private account: Account,
    private bus: EventsService,
    private context: ContextService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dataService: ScheduleDataService,
    private dialogRef: MatDialogRef<ViewMeetingDialog>,
    private fb: FormBuilder,
    private formUtils: FormUtils,
    private notify: NotifierService,
    private organization: Organization,
    private router: Router,
    private schedule: Schedule,
    private translate: TranslateService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.initialize()
    this.initTranslations()
    this.setupAutocomplete()
  }

  async onSubmit(recreate: boolean = this.editMode === 'recurring') {
    if (!this.form.valid) {
      this.formUtils.markAsTouched(this.form)
      this.form.updateValueAndValidity()
    }

    this.isLoading = true
    try {
      const data = this.form.value

      const addMeetingRequest: AddMeetingRequest = {
        title: data.title,
        startTime: data.startTime.format(),
        endTime: moment(data.startTime)
          .add(moment.duration(data.duration))
          .format(),
        meetingTypeId: data.meetingTypeId.typeId,
        organizationId: data.clinic,
        attendees: this.attendees.map((a) => {
          delete a.accountType
          return a
        })
      }

      const clinic = await this.organization.getSingle(data.clinic)

      if (data.location && data.location.streetAddress) {
        addMeetingRequest.location = data.location
        addMeetingRequest.location.country = data.location.country
          ? data.location.country
          : clinic.address.country || 'US'
      } else {
        addMeetingRequest.location = {
          streetAddress: clinic.address.street,
          city: clinic.address.city,
          postalCode: clinic.address.postalCode,
          state: clinic.address.state,
          country: clinic.address.country
        }
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

      if (this.meeting.id) {
        if (this.addedAttendees.length > 0) {
          for (const attendee of this.addedAttendees) {
            try {
              const addAttendeeRequest: AddAttendeeRequest = {
                meetingId: this.meeting.id.toString(),
                attendees: [attendee]
              }
              await this.dataService.addAttendee(addAttendeeRequest)
            } catch (e) {
              await this.translate
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
          await this.dataService.deleteAttendee(this.meeting.id.toString(), id)
        }

        if (!this.meeting.recurring && addMeetingRequest.recurring) {
          recreate = true
        }
      }

      if (recreate) {
        this.meeting.id = await this.dataService.recreateMeeting(
          addMeetingRequest,
          this.meeting.id,
          this.meeting.recurring
        )

        this.notify.success(_('NOTIFY.SUCCESS.MEETING_UPDATED'))
        this.bus.trigger('schedule.table.refresh')
        this.dialogRef.close()
      } else {
        await this.dataService.saveMeeting(addMeetingRequest, +this.meeting.id)
        this.notify.success(_('NOTIFY.SUCCESS.MEETING_UPDATED'))
        this.bus.trigger('schedule.table.refresh')

        this.initialize(await this.dataService.fetchMeeting(this.meeting.id))
        this.state = 'view'
        this.addedAttendees = []
        this.removedAttendees = []
      }
    } catch (err) {
      this.notify.error(err)
    } finally {
      this.isLoading = false
    }
  }

  async deleteMeeting() {
    try {
      const recurringFormValue = this.deleteRecurringForm.value

      if (this.meeting.recurring) {
        switch (recurringFormValue.deleteMode) {
          case 'single':
            await this.doDeleteSingle()
            break
          case 'recurring':
            await this.doDeleteRecurring()
            break
          case 'recurringAfter':
            await this.doDeleteRecurring(true)
            break
        }
      } else {
        await this.doDeleteSingle()
      }
      this.dialogRef.close()
    } catch (error) {
      this.notify.error(error)
    }
  }

  endRepeatChanged(option): void {
    if (option === 'never') {
      this.form.get('endAfter').reset(null)
    }
  }

  repeatChanged(option): void {
    if (option === 'never') {
      this.form.get('endRepeat').reset('never')
      this.form.get('endAfter').reset(null)
    }
  }

  showDieter(account: any): void {
    if (account.accountType.id === '3') {
      account.accountType = '3'
      account.id = account.account
      this.router.navigate([this.context.getProfileRoute(account)])
      this.dialogRef.close()
    }
  }

  async attendanceChange(account: any, attendance: AttendanceStatusEntry) {
    try {
      const updateAttendance: UpdateAttendanceRequest = {
        id: account.attendance.id,
        attended: false,
        account: account.account,
        status: attendance.id
      }

      await this.dataService.updateAttendanceRequest(updateAttendance)
      account.attendance.status = attendance
    } catch (e) {
      await this.translate
        .get([_('NOTIFY.ERROR.UPDATE_ATTENDANCE')])
        .subscribe((translations) => {
          throw translations['NOTIFY.ERROR.UPDATE_ATTENDANCE']
        })
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
          (a) => !this.attendees.some((sa) => sa.account === a.id)
        )
        if (this.accounts.length > 0) {
          this.trigger.openPanel()
        }
      })
      .catch((err) => this.notify.error(err))
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
    const participantIds = this.attendees.map((a) => a.account)
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

      if (!this.removedAttendees.some((id) => id === attendee.id)) {
        this.addedAttendees.push(attendee)
      } else {
        this.removedAttendees = this.removedAttendees.filter(
          (id) => id !== attendee.id
        )
      }
    }
    this.accounts = []
  }

  public disableRecurringControls(): void {
    this.form.controls.repeat.disable()
    this.form.controls.endRepeat.disable()
  }

  public enableRecurringControls(): void {
    this.form.controls.repeat.enable()
    this.form.controls.endRepeat.enable()
  }

  removeParticipant(id: string): void {
    this.attendees = this.attendees.filter((a) => a.account !== id)

    if (!this.addedAttendees.some((a) => a.account === id)) {
      this.removedAttendees.push(id)
    } else {
      this.addedAttendees = this.addedAttendees.filter((a) => id !== a.account)
    }
  }

  resetParticipants(): void {
    this.attendees.length = 0
    this.addParticipant(this.context.selected)
  }

  private calculateEndAfterValue(meeting: Meeting): string {
    if (!meeting.recurring) {
      return ''
    }

    const interval = meeting.template.interval

    const startDate = moment(meeting.date)
    const endDate = moment(meeting.template.range.end)

    let repeatAmount = 0

    while (startDate.isBefore(endDate)) {
      ++repeatAmount
      startDate.add(interval.split(' ')[0], 'days')
    }

    return repeatAmount.toString()
  }

  private calculateEndRepeatValue(meeting: Meeting): string {
    if (!meeting.recurring) {
      return ''
    }
    const startDate = moment(meeting.date)
    const endDate = moment(meeting.template.range.end)

    if (Math.abs(startDate.diff(endDate, 'years')) >= 2) {
      return 'never'
    } else {
      return 'after'
    }
  }

  private calculateRepeatValue(meeting: Meeting): string {
    if (!meeting.recurring) {
      return ''
    }

    switch (meeting.template.interval) {
      case '7 days':
        return '1w'
      case '14 days':
        return '2w'
      case '28 days':
        return '4w'
      default:
        return ''
    }
  }

  private createForm() {
    const initial = this.formUtils.getInitialDate()

    this.form = this.fb.group(
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
        location: this.fb.group(
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

    this.deleteRecurringForm = this.fb.group({
      after: [moment().startOf('day'), Validators.required],
      deleteMode: ['recurring', Validators.required]
    })
  }

  private async doDeleteRecurring(readForm: boolean = false) {
    try {
      const after = moment(this.deleteRecurringForm.value.after).startOf('day')
      await this.schedule.deleteRecurringMeeting({
        id: this.meeting.id,
        after: readForm ? after.toISOString() : undefined
      })
      this.notify.success(_('NOTIFY.SUCCESS.MEETING_RECURRING_DELETED'))
      this.bus.trigger('schedule.table.refresh')
    } catch (error) {
      this.notify.error(error)
    }
  }

  private async doDeleteSingle() {
    try {
      await this.schedule.deleteMeeting(this.meeting.id)

      this.isUnavailable(this.meeting)
        ? _('NOTIFY.SUCCESS.UNAVAILABILITY_DELETED')
        : _('NOTIFY.SUCCESS.MEETING_DELETED')

      this.bus.trigger('schedule.table.refresh')
    } catch (error) {
      this.notify.error(error)
    }
  }

  private fetchAccountData(meeting): Promise<AccSingleResponse[]> {
    const promises = []
    meeting.attendees.forEach((attendee) =>
      promises.push(this.account.getSingle(attendee.id))
    )
    return Promise.all(promises)
  }

  private async initialize(meeting: Meeting = this.data.meeting) {
    try {
      this.currentAccount = this.context.user
      this.meeting = meeting
      this.createForm()
      this.subscribeToEvents()
      this.resetForm(meeting)
    } catch (error) {
      this.notify.error(error)
    }
  }

  private initTranslations() {
    this.translate
      .get([_('GLOBAL.COACH'), _('GLOBAL.PATIENT')])
      .subscribe((translations) => (this.translations = translations))
  }

  private isUnavailable(meeting: any) {
    return meeting.type.id === 4
  }

  private meetingTypeChanged(type) {
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

  private async resetForm(meeting: Meeting) {
    try {
      this.isLoading = true
      this.form.patchValue({
        title: meeting.title,
        date: meeting.date,
        startTime: meeting.date,
        clinic: meeting.organization.hierarchy[0],
        repeat: this.calculateRepeatValue(meeting),
        endRepeat: this.calculateEndRepeatValue(meeting),
        endAfter: this.calculateEndAfterValue(meeting)
      })
      this.form
        .get('location')
        .patchValue(meeting.location ? meeting.location : {})

      const startTime = this.meeting.date
      const endTime = this.meeting.endDate
      const momentDuration = moment.duration(endTime.diff(startTime))

      this.meetingDuration = momentDuration.humanize()
      this.isFuture = startTime.isAfter(moment(), 'minutes')

      const attendees = await this.fetchAccountData(meeting)
      this.meeting.attendees.forEach(
        (attendee, index) =>
          (attendee.accountType = attendees[index].accountType)
      )
      const meetingTypes = await this.dataService.fetchMeetingTypes(
        this.meeting.organization.hierarchy[0]
      )

      let duration
      this.meetingTypes = meetingTypes.filter(
        (t) => [4].indexOf(t.typeId) === -1
      )
      let meetingType
      if (meetingTypes.length) {
        meetingType = this.meetingTypes.find(
          (t) => +t.typeId === +this.meeting.type.id
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
        meetingTypeId: meetingType,
        duration: duration ? duration.value : null
      })
      this.attendees = this.meeting.attendees
    } catch (error) {
      this.notify.error(error)
    } finally {
      this.isLoading = false
      this.state = 'view'
    }
  }

  private subscribeToEvents() {
    this.form
      .get('meetingTypeId')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((type: FetchMeetingTypesResponse) =>
        this.meetingTypeChanged(type)
      )
  }

  private validateForm(control: AbstractControl) {
    const startTime = control.get('startTime').value
    if (startTime) {
      if (startTime.isBefore(moment(), 'minutes')) {
        return { validateMeetingTime: _('NOTIFY.ERROR.DATE_SHOULD_BE_FUTURE') }
      } else {
        return null
      }
    }
  }

  private validateLocation(control: AbstractControl) {
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
}
