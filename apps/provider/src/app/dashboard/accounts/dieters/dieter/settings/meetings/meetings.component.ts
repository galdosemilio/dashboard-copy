import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ContextService, EventsService, NotifierService } from '@app/service'
import {
  Meeting,
  MeetingsDatabase,
  MeetingsDataSource,
  ScheduleListTableComponent,
  _
} from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { OrganizationEntity } from '@coachcare/sdk'

type QuickSelectOption = 'past' | 'upcoming' | 'all'

@UntilDestroy()
@Component({
  selector: 'app-dieter-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class DieterMeetingsComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(ScheduleListTableComponent, { static: true })
  listTable: ScheduleListTableComponent

  form: FormGroup
  meetingsSource: MeetingsDataSource
  form$: Subject<void> = new Subject<void>()
  selectedClinic?: OrganizationEntity
  meetingStatusOptions = [
    { value: 'active', viewValue: _('MEETINGS.ACTIVE_MEETINGS') },
    { value: 'inactive', viewValue: _('MEETINGS.DELETED_METTINGS') },
    { value: 'all', viewValue: _('MEETINGS.ALL_MEETINGS') }
  ]
  quickSelectOptions = [
    { value: 'all', viewValue: _('MEETINGS.ALL') },
    { value: 'upcoming', viewValue: _('MEETINGS.UPCOMING') },
    { value: 'past', viewValue: _('MEETINGS.PAST') }
  ]

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private database: MeetingsDatabase,
    private fb: FormBuilder,
    private notifier: NotifierService
  ) {
    this.quickSelectHandler = this.quickSelectHandler.bind(this)
  }

  ngOnDestroy(): void {
    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  ngOnInit(): void {
    this.bus.trigger('right-panel.component.set', 'addConsultation')
    setTimeout(() => {
      this.bus.trigger(
        'right-panel.consultation.display.set-as-unavailable',
        false
      )
    }, 25) // set time for disable "Set as unavailable", b/c it does not work if the event happens in the same time with set right component
    this.createForm()
    this.createSource()

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.paginator.firstPage())
  }

  async downloadCSV() {
    try {
      this.meetingsSource.isLoading = true
      this.meetingsSource.change$.next()
      const separator = ','
      const criteria: any = {
        ...this.meetingsSource.args,
        limit: 'all',
        offset: 0
      }

      const response = await this.database.fetch(criteria).toPromise()

      const meetings = response.data.map((element) => new Meeting(element))
      const orgName = this.context.organization.name.replace(/\s/g, '_')
      const filename = `${orgName}_Schedule_List.csv`
      const mostAttendees = Math.max(...meetings.map((m) => m.attendees.length))

      let csv = ''
      csv += 'SCHEDULE LIST\r\n'
      csv +=
        'ID' +
        separator +
        'TITLE' +
        separator +
        'START TIME' +
        separator +
        'END TIME' +
        separator +
        'MEETING TYPE' +
        separator +
        'ORGANIZATION NAME' +
        separator

      for (let i = 0; i < mostAttendees; ++i) {
        csv += `ID (${i + 1})${separator}`
        csv += `FIRST NAME (${i + 1})${separator}`
        csv += `LAST NAME (${i + 1})${separator}`
        csv += `EMAIL (${i + 1})${separator}`
        csv += `ATTENDANCE (${i + 1})`

        if (i + 1 < mostAttendees) {
          csv += `${separator}`
        }
      }

      csv += '\r\n'

      meetings.forEach((meeting) => {
        csv += `"${meeting.id}"${separator}`
        csv += `"${meeting.title}"${separator}`
        csv += `"${meeting.date.toISOString()}"${separator}`
        csv += `"${meeting.endDate.toISOString()}"${separator}`
        csv += `"${meeting.type.description}"${separator}`
        csv += `"${meeting.organization.name}"${separator}`

        meeting.attendees.forEach((attendee, index) => {
          csv += `"${attendee.id}"${separator}`
          csv += `"${attendee.firstName}"${separator}`
          csv += `"${attendee.lastName}"${separator}`
          csv += `"${attendee.email}"${separator}`
          csv += `"${
            attendee.attendance && attendee.attendance.status
              ? attendee.attendance.status.name
              : '-'
          }"`

          if (index + 1 < meeting.attendees.length) {
            csv += `${separator}`
          }
        })

        csv += '\r\n'
      })

      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.meetingsSource.isLoading = false
      this.meetingsSource.change$.next()
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      endDate: [moment()],
      query: [],
      quickSelect: 'past',
      startDate: [moment().startOf('year')],
      meetingStatus: 'active'
    })

    merge(
      this.form.controls.startDate.valueChanges,
      this.form.controls.endDate.valueChanges,
      this.form.controls.meetingStatus.valueChanges
    )
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(() => {
        this.meetingsSource.resetPaginator()
        this.form$.next()
      })

    this.form.controls.quickSelect.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(this.quickSelectHandler)

    setTimeout(() => this.form.controls.quickSelect.setValue('upcoming'))
  }

  private createSource(): void {
    this.meetingsSource = new MeetingsDataSource(
      this.database,
      this.paginator,
      this.context.organization.meetingTypes
    )

    this.meetingsSource.addDefault({
      account: this.context.accountId
    })

    this.meetingsSource.addOptional(this.context.organization$, () => ({
      organization: this.selectedClinic?.id
    }))

    this.meetingsSource.addOptional(this.form$, () => ({
      range: {
        start: this.form.value.startDate
          ? this.form.value.startDate.toISOString()
          : undefined,
        end: this.form.value.endDate
          ? this.form.value.endDate.toISOString()
          : undefined
      },
      status: {
        meeting: this.form.value.meetingStatus
      }
    }))
  }

  private quickSelectHandler(quickSelect: QuickSelectOption): void {
    let newFormValue = {}
    switch (quickSelect) {
      case 'all':
        newFormValue = {
          startDate: moment('2019-01-01', 'YYYY-MM-DD').startOf('day'),
          endDate: moment().add(3, 'months').endOf('month')
        }
        break
      case 'past':
        newFormValue = {
          startDate: moment('2019-01-01', 'YYYY-MM-DD').startOf('day'),
          endDate: moment()
        }
        this.listTable.sort.direction = 'desc'
        this.listTable.sort.sortChange.emit()
        break
      case 'upcoming':
        newFormValue = {
          startDate: moment(),
          endDate: moment().add(3, 'months').endOf('month')
        }
        this.listTable.sort.direction = 'asc'
        this.listTable.sort.sortChange.emit()
        break
      default:
        break
    }

    this.form.patchValue(newFormValue, { emitEvent: false })
    this.meetingsSource.resetPaginator()
  }

  public onRemoveClinic(): void {
    this.selectedClinic = null
    this.meetingsSource.resetPaginator()
    this.form$.next()
  }

  public onSelectClinic(clinic: OrganizationEntity): void {
    this.selectedClinic = clinic
    this.meetingsSource.resetPaginator()
    this.form$.next()
  }
}
