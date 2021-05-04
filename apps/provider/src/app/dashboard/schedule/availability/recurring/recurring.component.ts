import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import * as moment from 'moment-timezone'
import { Schedule } from '@coachcare/sdk'

import { RecurringAddDialog } from '@app/dashboard/schedule/dialogs/recurring-add.dialog'
import { ContextService, NotifierService, SelectedAccount } from '@app/service'
import { _, PromptDialog } from '@app/shared'

export interface ScheduleAvailabilityRecurringSegment {
  id: string
  account: string
  day: number
  start: moment.Moment
  end: moment.Moment
}

@Component({
  selector: 'app-schedule-availability-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.scss']
})
export class ScheduleAvailabilityRecurringComponent implements OnInit {
  private user: SelectedAccount
  private emptySegment: any

  public days = []
  public segments: ScheduleAvailabilityRecurringSegment[] = []

  constructor(
    private dialog: MatDialog,
    private schedule: Schedule,
    private context: ContextService,
    private notifier: NotifierService
  ) {
    const currentLocale = moment.locale()
    const day = moment().locale('en').startOf('week')
    day.locale(currentLocale)

    // TODO runtime date formatting
    this.days = [
      day.format('dddd'),
      day.add(1, 'day').format('dddd'),
      day.add(1, 'day').format('dddd'),
      day.add(1, 'day').format('dddd'),
      day.add(1, 'day').format('dddd'),
      day.add(1, 'day').format('dddd'),
      day.add(1, 'day').format('dddd')
    ]
  }

  ngOnInit() {
    this.context.selected$.subscribe((user) => {
      if (user) {
        this.user = user
        this.loadAvailability()
      }
    })

    this.emptySegment = {
      id: '',
      start: '-',
      end: '-'
    }
  }

  public loadAvailability() {
    this.schedule
      .fetchRecurrentAvailability(this.user.id)
      .then((response) => {
        this.segments.length = 0
        if (response.length > 0) {
          this.segments = response.map((v) => {
            const startTime = moment.duration(v.startTime)
            const startDate = moment.utc().day(v.day).set({
              hours: startTime.hours(),
              minutes: startTime.minutes(),
              seconds: 0
            })

            const endTime = moment.duration(v.endTime)
            const endDate = moment.utc().day(v.day).set({
              hours: endTime.hours(),
              minutes: endTime.minutes(),
              seconds: 0
            })

            return {
              id: v.id,
              account: v.account,
              day: startDate.day(),
              start: startDate,
              end: endDate
            }
          })
        }

        for (let i = 0; i < 7; i++) {
          // insert the add rows
          this.segments.push({
            day: i,
            account: this.user.id,
            ...this.emptySegment
          })
        }
        this.sortSegments()
      })
      .catch((err) => this.notifier.error(err))
  }

  public deleteSegment(segment: ScheduleAvailabilityRecurringSegment) {
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
          this.schedule
            .deleteRecurrentAvailability(segment.id)
            .then(() => {
              if (
                this.segments.filter((s) => s.day === segment.day).length <= 1
              ) {
                this.segments.push({
                  day: segment.day,
                  account: this.user.id,
                  ...this.emptySegment
                })
              }
              this.segments = this.segments.filter((s) => s.id !== segment.id)
              this.sortSegments()
            })
            .catch((err) => this.notifier.error(err))
        }
      })
  }

  public deleteAll() {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.RESET_ALL'),
          content: _('BOARD.CONFIRM_RESET_AVAILABILITY')
        }
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.schedule
            .deleteAllAvailability(this.user.id)
            .then(() => {
              this.segments = []
              for (let i = 0; i < 7; i++) {
                this.segments.push({
                  day: i,
                  account: this.user.id,
                  ...this.emptySegment
                })
              }
            })
            .catch((err) => this.notifier.error(err))
        }
      })
  }

  public openDialog(segment: ScheduleAvailabilityRecurringSegment) {
    this.dialog
      .open(RecurringAddDialog, {
        disableClose: true,
        data: {
          provider: segment.account,
          startDay: segment.day,
          endDay: segment.day,
          timezone: this.user.timezone
        }
      })
      .afterClosed()
      .subscribe((recurringAvailable) => {
        if (recurringAvailable) {
          const createdSegment: ScheduleAvailabilityRecurringSegment = {
            ...recurringAvailable,
            account: this.user.id,
            day: recurringAvailable.start.day()
          }
          this.segments.push(createdSegment)
          this.sortSegments()
        }
      })
  }

  public showTimeInFormat(time: string) {
    const timeFormat = moment(time, 'HH:mm:ss')
    return timeFormat.isValid() ? timeFormat.format('h:mm a') : time
  }

  public isFirst(segment: ScheduleAvailabilityRecurringSegment): boolean {
    return (
      this.segments.findIndex((other) => other.day === segment.day) ===
      this.segments.indexOf(segment)
    )
  }

  private sortSegments() {
    this.segments.sort((left, right) => {
      if (left.day === right.day) {
        if (!left.id || !right.id) {
          return !left.id ? 1 : -1
        }
        const leftStart = moment(left.start, 'HH:mm:ss')
        const rightStart = moment(right.start, 'HH:mm:ss')
        return leftStart.isBefore(rightStart)
          ? -1
          : leftStart.isAfter(rightStart)
          ? 1
          : 0
      } else {
        return left.day - right.day
      }
    })
  }
}
