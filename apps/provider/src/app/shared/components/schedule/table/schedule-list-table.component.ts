import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatSort } from '@coachcare/material'
import {
  ContextService,
  EventsService,
  NotifierService,
  ScheduleDataService
} from '@app/service'
import { AttendanceStatusEntry, UpdateAttendanceRequest } from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Schedule } from '@coachcare/sdk'
import { PromptDialog } from '@app/shared/dialogs/prompt.dialog'
import { DeleteRecurringMeetingDialog } from '../dialogs/delete-recurring-meeting'
import { ViewMeetingDialog } from '../dialogs/view-meeting'
import { Meeting } from '@app/shared/model'
import { MeetingsDataSource } from '../services'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-schedule-list-table',
  templateUrl: './schedule-list-table.component.html',
  styleUrls: ['./schedule-list-table.component.scss']
})
export class ScheduleListTableComponent implements OnDestroy, OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort

  @Input() source: MeetingsDataSource

  columns: string[] = [
    'date',
    'time',
    'duration',
    'organization',
    'title',
    'attendees',
    'actions'
  ]
  meetings: any[] = []

  constructor(
    private bus: EventsService,
    private dataService: ScheduleDataService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private schedule: Schedule,
    private context: ContextService
  ) {}

  ngOnDestroy(): void {
    this.source.unsetSorter()
  }

  ngOnInit(): void {
    this.source.setSorter(
      this.sort,
      () =>
        ({
          sort: [
            {
              property: this.sort.active || 'start',
              dir: this.sort.direction || 'asc'
            }
          ]
        } as any)
    )

    this.bus.register('schedule.table.refresh', () => {
      this.source.refresh()
    })
  }

  async onChangeAttendance(
    attendanceStatusEntry: AttendanceStatusEntry,
    attendee: any
  ) {
    try {
      const updateAttendance: UpdateAttendanceRequest = {
        id: attendee.attendance.id,
        status: attendanceStatusEntry.id
      }

      await this.dataService.updateAttendanceRequest(updateAttendance)
      attendee.attendance.status = attendanceStatusEntry
      this.notifier.success(_('NOTIFY.SUCCESS.UPDATE_ATTENDANCE'))
    } catch (e) {
      this.notifier.error(_('NOTIFY.ERROR.UPDATE_ATTENDANCE'))
    }
  }

  deleteMeeting(meeting: Meeting) {
    if (meeting.recurring) {
      this.dialog
        .open(DeleteRecurringMeetingDialog, { data: { meeting } })
        .afterClosed()
        .pipe(filter((result) => result))
        .subscribe(async (result: any) => {
          try {
            if (
              result.deleteMode === 'recurringAfter' ||
              result.deleteMode === 'recurring'
            ) {
              await this.schedule.deleteRecurringMeeting(result.query)
            } else {
              await this.schedule.deleteMeeting(result.query.id)
            }
            this.notifier.success(_('NOTIFY.SUCCESS.MEETING_RECURRING_DELETED'))
            this.bus.trigger('schedule.table.refresh')
          } catch (error) {
            this.notifier.error(error)
          }
        })
    } else {
      this.dialog
        .open(PromptDialog, {
          data: {
            content: _('BOARD.SCHEDULE_DELETE_CONFIRM'),
            title: _('GLOBAL.NOTICE')
          }
        })
        .afterClosed()
        .pipe(
          untilDestroyed(this),
          filter((confirm) => confirm)
        )
        .subscribe(async () => {
          try {
            await this.schedule.deleteMeeting(meeting.id)
            this.bus.trigger('schedule.table.refresh')
          } catch (error) {
            this.notifier.error(error)
          }
        })
    }
  }

  viewMeeting(meeting: Meeting) {
    this.dialog.open(ViewMeetingDialog, {
      data: { meeting: meeting },
      width: '80vw',
      panelClass: 'ccr-full-dialog',
      disableClose: true
    })
  }
}
