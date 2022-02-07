import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { Store } from '@ngrx/store'
import { isEmpty, range } from 'lodash'
import * as moment from 'moment-timezone'
import { OrganizationEntity, Schedule } from '@coachcare/sdk'

import { CCRConfig } from '@app/config'
import { OpenPanel } from '@app/layout/store'
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedAccount
} from '@app/service'
import {
  _,
  DateNavigatorOutput,
  OptionsDialog,
  PromptDialog,
  ViewMeetingDialog,
  ViewAllMeetingsDialog,
  Meeting
} from '@app/shared'
import {
  FetchAllMeetingRequest,
  FetchCalendarAvailabilitySegment
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { SelectOrganizationDialog } from '@app/shared/dialogs/select-organization'
import { DeviceDetectorService } from 'ngx-device-detector'
import { Subject } from 'rxjs'
import { debounceTime, filter } from 'rxjs/operators'

export interface TimeBlock {
  display: string
  duration: number
  time: Date
  cells: TimeBlockCell[]
}

interface TimeBlockCell {
  isAvailable: boolean
  meetings: Meeting[]
  time: Date
  duration: number
}

type ScheduleCalendarTimeRange = 'month' | 'day' | 'week'

const MEETING_SPACING_SIZE = 1
const meetingHeightTimeRange = {
  day: 50,
  week: 25,
  month: 100
}

@UntilDestroy()
@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss']
})
export class ScheduleCalendarComponent
  implements OnDestroy, OnInit, AfterViewChecked
{
  @ViewChild('tbody', { static: false }) tbody: ElementRef
  @ViewChildren('trow') rows: Array<ElementRef>

  public days: Array<string> = [moment().format('ddd D')]
  public hasLoaded = false
  public startDate: any = moment().set({ hours: 0, minutes: 0, seconds: 0 })
  public timeBlocks: Array<TimeBlock> = []
  public timerange: ScheduleCalendarTimeRange = 'week'
  public selectedMeeting = ''
  public clickedMeeting: any
  public dates: DateNavigatorOutput = {}
  public selectedOrg?: OrganizationEntity
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018626192-Viewing-the-Dashboard-Schedules'

  private selectedUser: SelectedAccount
  private getMeetings$: Subject<void> = new Subject<void>()
  private isTableScrolled = false

  constructor(
    private cdr: ChangeDetectorRef,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private store: Store<CCRConfig>,
    private schedule: Schedule,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  public ngOnDestroy() {
    this.bus.unregister('schedule.table.selected')
    this.bus.unregister('schedule.table.refresh')
  }

  public ngOnInit(): void {
    this.generateTimes([], [])
    this.selectedUser = this.context.selected
    this.selectedOrg = this.context.selectedClinic

    this.context.selectedClinic$
      .pipe(untilDestroyed(this))
      .subscribe((clinic) => {
        this.selectedOrg = clinic
        this.getMeetings(this.dates)
      })

    this.context.selected$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user && this.selectedUser !== user) {
        this.selectedUser = user
        this.getMeetings(this.dates)
      }
    })

    this.getMeetings$
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe(() => {
        this.getMeetings(this.dates)
      })

    setTimeout(
      () =>
        this.context.organization$.pipe(untilDestroyed(this)).subscribe(() => {
          this.getMeetings(this.dates)
          // prevents exception when changing timeframe from child component
          this.cdr.detectChanges()
        }),
      500
    )

    // this.bus.trigger('organizations.disable-all');

    this.bus.trigger('right-panel.component.set', 'addConsultation')
    this.bus.trigger('right-panel.consultation.form', {
      form: 'addConsultation'
    })

    this.bus.register('schedule.table.selected', this.setSelected.bind(this))
    this.bus.register('schedule.table.refresh', () => {
      this.getMeetings(this.dates)
    })
  }

  public ngAfterViewChecked(): void {
    if (this.rows.length === 96 && !this.isTableScrolled) {
      const targetElement = this.rows.find(
        (r) => r.nativeElement.className === 'seven-am-row'
      ).nativeElement
      if (targetElement) {
        this.isTableScrolled = true
        targetElement.scrollIntoView(true)
      }
    }
  }

  public changeTimeRange(timerange: ScheduleCalendarTimeRange): void {
    this.hasLoaded = false
    this.timerange = timerange
    this.isTableScrolled = this.timerange !== 'month' ? false : true
  }

  public setSelected(value: string) {
    this.selectedMeeting = value
  }

  public clickMeeting(meeting: any) {
    if (meeting.access === 'restricted') {
      return
    }

    this.clickedMeeting = meeting
    if (this.isUnavailable(meeting)) {
      if (this.futureMeeting(meeting)) {
        this.deleteMeeting()
      }
    } else {
      this.viewMeeting()
    }
  }

  public editMeeting() {
    if (this.selectedMeeting !== this.clickedMeeting.id) {
      // force showing the panel on mobile
      this.store.dispatch(new OpenPanel())
      this.bus.trigger('right-panel.consultation.form', {
        form: 'editConsultation',
        id: this.clickedMeeting.id
      })
      this.selectedMeeting = this.clickedMeeting.id
    }
  }

  public deleteMeeting() {
    if (this.clickedMeeting.recurring) {
      // recurring prompt
      this.dialog
        .open(OptionsDialog, {
          data: {
            title: _('BOARD.DELETE_RECURRING_MEETING'),
            content: _('BOARD.DELETE_RECURRING_MEETING_CONFIRM'),
            contentParams: {
              date: moment(this.clickedMeeting.startTime).format('LL'),
              start: moment(this.clickedMeeting.startTime).format('LT'),
              end: moment(this.clickedMeeting.endTime).format('LT')
            },
            options: [
              {
                viewValue: _('BOARD.DELETE_SINGLE_MEETING'),
                value: 'single',
                color: 'warn'
              },
              {
                viewValue: _('BOARD.DELETE_ALL_MEETINGS'),
                value: 'recurring',
                color: 'warn'
              }
            ]
          }
        })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm === 'recurring') {
            this.doDeleteRecurring()
          } else if (confirm === 'single') {
            this.doDeleteSingle()
          }
        })
    } else {
      this.dialog
        .open(PromptDialog, {
          data: {
            title: this.isUnavailable(this.clickedMeeting)
              ? _('BOARD.DELETE_UNAVAILABILITY')
              : _('BOARD.DELETE_MEETING'),
            content: this.isUnavailable(this.clickedMeeting)
              ? _('BOARD.DELETE_UNAVAILABILITY_CONFIRM')
              : _('BOARD.DELETE_MEETING_CONFIRM'),
            contentParams: {
              date: moment(this.clickedMeeting.startTime).format('LL'),
              start: moment(this.clickedMeeting.startTime).format('LT'),
              end: moment(this.clickedMeeting.endTime).format('LT')
            }
          }
        })
        .afterClosed()
        .pipe(filter((confirm) => confirm))
        .subscribe(() => this.doDeleteSingle())
    }
  }

  public viewMeeting() {
    this.dialog.open(ViewMeetingDialog, {
      data: { meeting: this.clickedMeeting },
      width: '80vw',
      panelClass: 'ccr-full-dialog',
      disableClose: true
    })
  }

  public viewAllMeetings(cell: TimeBlockCell) {
    this.dialog.open(ViewAllMeetingsDialog, {
      data: { meetings: cell.meetings, time: cell.time },
      panelClass: 'ccr-full-dialog',
      disableClose: true
    })
  }

  public futureMeeting(meeting: any) {
    return moment(meeting.startTime).isAfter(moment(), 'minutes')
  }

  public calculateTop(meeting: Meeting): number {
    const minutes = meeting.date.minutes() % 15
    return (minutes * 100) / 15
  }

  public calculateHeight(meeting: Meeting): number {
    const diff = meeting.endDate.diff(meeting.date, 'minutes')
    return (
      (diff * meetingHeightTimeRange[this.timerange]) / 15 -
      MEETING_SPACING_SIZE
    )
  }

  public selectedDate(dates: DateNavigatorOutput): void {
    this.dates = dates
    this.getMeetings$.next()
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges()
  }

  public showClinicSelectDialog(): void {
    this.dialog
      .open(SelectOrganizationDialog, {
        data: {
          title: _('BOARD.VIEW_SCHEDULE_BY_CLINIC')
        },
        width: !this.deviceDetector.isMobile() ? '60vw' : undefined
      })
      .afterClosed()
      .pipe(filter((org) => org))
      .subscribe((org: OrganizationEntity) => {
        this.context.selectedClinic = org
      })
  }

  private doDeleteRecurring() {
    this.schedule
      .deleteRecurringMeeting(this.clickedMeeting.id)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.MEETING_RECURRING_DELETED'))
        this.bus.trigger('schedule.table.refresh')
      })
      .catch((err) => this.notifier.error(err))
  }

  private doDeleteSingle() {
    this.schedule
      .deleteMeeting(this.clickedMeeting.id)
      .then(() => {
        this.notifier.success(
          this.isUnavailable(this.clickedMeeting)
            ? _('NOTIFY.SUCCESS.UNAVAILABILITY_DELETED')
            : _('NOTIFY.SUCCESS.MEETING_DELETED')
        )
        this.bus.trigger('schedule.table.refresh')
      })
      .catch((err) => this.notifier.error(err))
  }

  private generateTimes(
    meetings: Meeting[],
    availabilities: FetchCalendarAvailabilitySegment[]
  ): void {
    this.timeBlocks.length = 0

    let startDate = !isEmpty(this.dates)
      ? moment(this.dates.startDate).startOf('day')
      : this.startDate.clone().startOf('day')

    let endDate = !isEmpty(this.dates)
      ? moment(
          this.timerange === 'month' ? this.dates.endDate : this.dates.startDate
        ).endOf('day')
      : this.startDate.clone().endOf('day')

    if (this.timerange === 'month') {
      startDate = startDate.clone().startOf('week')
    }

    // so that we can offset all the dates to that year, ignoring DST
    const dayDiff = Math.abs(
      startDate.diff(startDate.clone().set('year', 1900), 'days')
    )
    startDate = startDate.subtract(dayDiff, 'days')
    endDate = endDate.subtract(dayDiff, 'days')

    const blockDuration = this.timerange === 'month' ? 24 * 60 * 7 : 15
    const cellCount = this.timerange === 'day' ? 1 : 7

    while (true) {
      const time =
        this.timeBlocks.length === 0
          ? startDate.toDate()
          : moment(this.timeBlocks[this.timeBlocks.length - 1].time)
              .add(blockDuration, 'minutes')
              .toDate()

      if (moment(time).isAfter(endDate)) {
        break
      }

      const today = moment()

      const cells: TimeBlockCell[] = range(cellCount).map((i) => {
        const cellTime = moment(time).add(i, 'day')
        const cellDuration = this.timerange === 'month' ? 24 * 60 : 15

        return {
          isToday: this.isToday(today, cellTime),
          isAvailable:
            this.timerange === 'month'
              ? moment(time).add(i, 'day').month() ===
                moment(this.dates.startDate).month()
              : availabilities.some((segment) => {
                  const targetTime = moment(time).add(i, 'days')
                  const startTime = moment(segment.startTime).subtract(
                    dayDiff,
                    'days'
                  )
                  const endTime = moment(segment.endTime).subtract(
                    dayDiff,
                    'days'
                  )

                  return (
                    targetTime.isBetween(startTime, endTime, null, '[]') &&
                    targetTime
                      .add(15, 'minutes')
                      .isBetween(startTime, endTime, null, '[]')
                  )
                }),
          meetings: meetings.filter((meeting) => {
            const meetingDate = meeting.date.clone().subtract(dayDiff, 'days')
            return meetingDate.isBetween(
              cellTime,
              cellTime.clone().add(cellDuration, 'minutes'),
              null,
              '[)'
            )
          }),
          duration: cellDuration,
          time: cellTime.toDate()
        }
      })

      const block = {
        display: moment(time).format('h:mm A'),
        duration: blockDuration,
        time: time,
        cells
      }

      this.timeBlocks.push(block)
    }
    this.hasLoaded = true
  }

  private getMeetings(date: DateNavigatorOutput) {
    if (!this.selectedUser || !date) {
      this.hasLoaded = true
      return
    }

    this.days =
      this.timerange === 'day'
        ? [moment(date.startDate).format('ddd D')]
        : Array.from(Array(7), (t, i) =>
            moment(date.startDate).add(i, 'day').format('ddd D')
          )

    const start =
      this.timerange === 'month'
        ? moment(date.startDate)
            .subtract(6, 'days')
            .startOf('day')
            .toISOString()
        : moment(date.startDate).startOf('day').toISOString()
    const end =
      this.timerange === 'month'
        ? moment(date.endDate).add(6, 'days').startOf('day').toISOString()
        : moment(date.endDate).endOf('day').toISOString()

    const availableRequest = {
      startTime: start,
      endTime: end,
      providers: [this.selectedUser.id]
    }

    const meetingRequest: FetchAllMeetingRequest = {
      organization: this.selectedOrg?.id,
      range: {
        start,
        end
      },
      account: this.selectedUser.id,
      limit: 'all'
    }

    Promise.all([
      this.schedule.fetchCalendarAvailability(availableRequest),
      this.schedule.fetchAllMeeting(meetingRequest)
    ])
      .then(([availableResponse, meetingResponse]) => {
        const cleanResponse = meetingResponse.data.map(
          (m) => new Meeting(m, this.context.organization.meetingTypes)
        )
        const meetings = new Array<Meeting>()
        cleanResponse.forEach((m) => {
          const nextDay = m.date.clone().add(1, 'day').startOf('day')
          if (m.endDate.isSameOrBefore(nextDay)) {
            const meeting = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m),
              organizationHierarchy:
                typeof m.organization.hierarchy === 'string' ||
                (m.organization.hierarchy as any) instanceof String
                  ? JSON.parse(m.organization.hierarchy.toString())
                  : m.organization.hierarchy
            }
            meetings.push(meeting)
          } else {
            const startMeeting: any = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m)
            }
            const endMeeting: any = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m)
            }

            startMeeting.endDate = nextDay
            endMeeting.date = nextDay

            meetings.push(startMeeting)
            meetings.push(endMeeting)
          }
        })
        this.generateTimes(meetings, availableResponse.entries)
      })
      .catch((err) => {
        this.hasLoaded = true
        this.notifier.error(err)
      })
  }

  private isUnavailable(meeting: any) {
    return meeting.type.id === 4
  }

  private selectableMeeting(meeting: any) {
    return this.futureMeeting(meeting)
  }

  private timeToDisplay(meeting: Meeting) {
    const start = meeting.date.format('h:mm')
    const end = meeting.endDate.format('h:mma')
    return `${start}-${end}`
  }

  private isToday(today: moment.Moment, time: moment.Moment): boolean {
    return today.format('MMM D') === time.format('MMM D')
  }
}
