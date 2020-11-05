import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatDialog, MatSort } from '@coachcare/common/material'
import { ScheduleDataService } from '@app/layout/right-panel/services'
import { EventsService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import {
  AttendanceStatusEntry,
  UpdateAttendanceRequest
} from '@coachcare/npm-api'
import { _ } from '@app/shared/utils'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Schedule } from '@coachcare/npm-api'
import { DeleteRecurringMeetingDialog, ViewMeetingDialog } from '../../dialogs'
import { Meeting } from '../../models'
import { MeetingsDataSource } from '../../services'

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
    private schedule: Schedule
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
        .subscribe(async (result: any) => {
          if (!result) {
            return
          }

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
        .pipe(untilDestroyed(this))
        .subscribe(async (confirm) => {
          if (confirm) {
            try {
              await this.schedule.deleteMeeting(meeting.id)
              this.bus.trigger('schedule.table.refresh')
            } catch (error) {
              this.notifier.error(error)
            }
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
