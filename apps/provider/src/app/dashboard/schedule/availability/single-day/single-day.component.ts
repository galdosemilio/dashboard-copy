import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/common/material'
import * as moment from 'moment-timezone'
import { Schedule } from '@coachcare/npm-api'

import { SingleAddDialog } from '@app/dashboard/schedule/dialogs/single-add.dialog'
import { ContextService, NotifierService, SelectedAccount } from '@app/service'
import { _, PromptDialog } from '@app/shared'
import {
  FetchAllAccountObjectResponse,
  FetchCalendarAvailabilityRequest,
  FetchCalendarAvailabilitySegment
} from '@coachcare/npm-api'

export type SingleDayAvailabilitySegment = FetchCalendarAvailabilitySegment & {
  startDate: string
  endDate: string
  newline: boolean
}

@Component({
  selector: 'app-schedule-availability-single',
  templateUrl: './single-day.component.html',
  styleUrls: ['./single-day.component.scss']
})
export class ScheduleAvailabilitySingleDayComponent implements OnInit {
  private user: SelectedAccount

  public segments: SingleDayAvailabilitySegment[] = []

  constructor(
    private dialog: MatDialog,
    private schedule: Schedule,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.context.selected$.subscribe((user) => {
      if (user) {
        this.user = user
        this.loadAvailability()
      }
    })
  }

  public loadAvailability() {
    const request: FetchCalendarAvailabilityRequest = {
      providers: [this.user.id],
      startTime: moment().toISOString()
    }
    this.schedule
      .fetchCalendarAvailability(request)
      .then((response) => {
        this.segments.length = 0
        if (response.entries.length > 0) {
          let date = moment().add(-1, 'day')
          this.segments = response.entries
            .filter((e) => e.isSingle)
            .map((e) => {
              const startDate = moment(e.startTime)
              const endDate = moment(e.endTime)
              const dates = {
                startDate: startDate.format('ll'),
                startTime: startDate.format('LT'),
                endDate: endDate.format('ll'),
                endTime: endDate.format('LT'),
                newline:
                  !date.isSame(startDate, 'day') ||
                  !startDate.isSame(endDate, 'day')
              }
              date = startDate
              return Object.assign({}, e, dates)
            })
        }
      })
      .catch((err) => this.notifier.error(err))
  }

  public deleteSegment(segment: SingleDayAvailabilitySegment) {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.DELETE_AVAILABILITY'),
          content: _('BOARD.CONFIRM_DELETE_AVAILABILITY')
        }
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          const promises = []
          segment.ids.forEach((i) => {
            if (segment.isSingle) {
              promises.push(this.schedule.deleteSingleAvailability(i))
            }
          })
          Promise.all(promises)
            .then(() => {
              this.notifier.success(_('NOTIFY.SUCCESS.TIME_BLOCK_DELETED'))
              this.loadAvailability()
            })
            .catch(() => {
              this.notifier.error(_('NOTIFY.ERROR.TIME_BLOCK_NOT_DELETED'))
            })
        }
      })
  }

  public openDialog() {
    this.dialog
      .open(SingleAddDialog, {
        disableClose: true,
        data: {
          provider: this.user.id
        }
      })
      .afterClosed()
      .subscribe((singleAvailability) => {
        if (singleAvailability) {
          this.loadAvailability()
        }
      })
  }
}
