import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { Meeting } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import {
  MeetingsDatabase,
  MeetingsDataSource,
  ScheduleListTableComponent
} from '@app/shared/components/schedule'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { merge, Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import Papa from 'papaparse'
import { OrganizationEntity } from '@coachcare/sdk'
import { CSV } from '@coachcare/common/shared'

type QuickSelectOption = 'past' | 'upcoming' | 'all'

@UntilDestroy()
@Component({
  selector: 'ccr-schedule-list',
  templateUrl: './schedule-list.component.html'
})
export class ScheduleListComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(ScheduleListTableComponent, { static: true })
  listTable: ScheduleListTableComponent

  filteredAccounts: any[] = []
  filteredAccounts$: Subject<void> = new Subject<any>()
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

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.bus.trigger('right-panel.component.set', 'addConsultation')

    this.createForm()
    this.createSource()

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((org) => this.onSelectClinic(org))
  }

  async downloadCSV() {
    try {
      this.meetingsSource.isLoading = true
      this.meetingsSource.change$.next()
      const criteria: any = {
        ...this.meetingsSource.args,
        limit: 'all',
        offset: 0
      }

      const response = await this.database.fetch(criteria).toPromise()

      const meetings = response.data.map((element) => new Meeting(element))
      const orgName = this.context.organization.name.replace(/\s/g, '_')
      const filename = `${orgName}_Schedule_List.csv`
      let mostAttendees = 0

      meetings.forEach(
        (meeting) =>
          (mostAttendees =
            meeting.attendees.length > mostAttendees
              ? meeting.attendees.length
              : mostAttendees)
      )

      let csv = 'SCHEDULE LIST\r\n'

      const data = meetings.map((meeting) => {
        const row = {
          ID: meeting.id,
          TITLE: meeting.title,
          'START TIME': meeting.date.toISOString(),
          'END TIME': meeting.endDate.toISOString(),
          'MEETING TYPE': meeting.type.description,
          'ORGANIZATION NAME': meeting.organization.name
        }

        meeting.attendees.forEach((attendee, index) => {
          row[`ID ${index + 1}`] = attendee.id
          row[`FIRST NAME ${index + 1}`] = attendee.firstName
          row[`LAST NAME ${index + 1}`] = attendee.lastName
          row[`EMAIL ${index + 1}`] = attendee.email
          row[`ATTENDANCE ${index + 1}`] =
            attendee.attendance && attendee.attendance.status
              ? attendee.attendance.status.name
              : '-'
        })

        return row
      })

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.meetingsSource.isLoading = false
      this.meetingsSource.change$.next()
    }
  }

  onAddAccount($event: any): void {
    if ($event.id && $event.firstName) {
      this.filteredAccounts.push($event)
      this.meetingsSource.resetPaginator()
      this.filteredAccounts$.next()
    }
  }

  onRemoveAccount(index: number): void {
    this.filteredAccounts.splice(index, 1)
    this.meetingsSource.resetPaginator()
    this.filteredAccounts$.next()
  }

  public onRemoveClinic(): void {
    this.selectedClinic = null
    this.meetingsSource.resetPaginator()
    this.filteredAccounts$.next()
  }

  public onSelectClinic(clinic: OrganizationEntity): void {
    this.selectedClinic = clinic
    this.meetingsSource.resetPaginator()
    this.filteredAccounts$.next()
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

    this.meetingsSource.addOptional(this.filteredAccounts$, () => ({
      account:
        this.filteredAccounts && this.filteredAccounts.length
          ? this.filteredAccounts[0].id
          : undefined
    }))

    this.meetingsSource.addOptional(this.form$, () => {
      const now = moment()
      const start = this.form.value.startDate
        ? now.isSame(this.form.value.startDate, 'day') &&
          this.form.value.quickSelect === 'upcoming'
          ? now.toISOString()
          : this.form.value.startDate.clone().startOf('day').toISOString()
        : undefined
      const end = this.form.value.endDate
        ? now.isSame(this.form.value.endDate, 'day') &&
          this.form.value.quickSelect === 'past'
          ? now.toISOString()
          : this.form.value.endDate.clone().endOf('day').toISOString()
        : undefined

      return {
        range: {
          start,
          end
        },
        status: {
          meeting: this.form.value.meetingStatus
        }
      }
    })

    this.meetingsSource.addOptional(this.context.organization$, () => ({
      organization: this.selectedClinic?.id
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
        this.listTable.sort.direction = 'asc'
        break
      case 'past':
        newFormValue = {
          startDate: moment('2019-01-01', 'YYYY-MM-DD').startOf('day'),
          endDate: moment()
        }
        this.listTable.sort.direction = 'desc'
        break
      case 'upcoming':
        newFormValue = {
          startDate: moment(),
          endDate: moment().add(3, 'months').endOf('month')
        }
        this.listTable.sort.direction = 'asc'
        break
      default:
        break
    }

    this.form.patchValue(newFormValue, { emitEvent: false })
    this.meetingsSource.resetPaginator()
  }
}
