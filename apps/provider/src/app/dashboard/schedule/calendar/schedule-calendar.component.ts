import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { Store } from '@ngrx/store';
import { isEmpty } from 'lodash';
import * as moment from 'moment-timezone';
import { Schedule } from 'selvera-api';

import { CCRConfig } from '@app/config';
import { OpenPanel } from '@app/layout/store';
import {
  ContextService,
  EventsService,
  NotifierService,
  SelectedAccount,
} from '@app/service';
import {
  _,
  DateNavigatorOutput,
  OptionsDialog,
  PromptDialog,
} from '@app/shared';
import {
  FetchAllMeetingRequest,
  FetchCalendarAvailabilitySegment,
} from '@app/shared/selvera-api';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ViewMeetingDialog } from '../dialogs/view-meeting';
import { Meeting } from '../models';

export interface TimeBlock {
  display: string;
  duration: number;
  time: Date;
  cells: {
    isAvailable: boolean;
    meeting: Meeting;
  }[];
}

// export type Meeting = FetchMeetingResponse & {
//   timeToDisplay: string;
// };

@Component({
  selector: 'app-schedule-calendar',
  templateUrl: './schedule-calendar.component.html',
  styleUrls: ['./schedule-calendar.component.scss'],
})
export class ScheduleCalendarComponent
  implements OnDestroy, OnInit, AfterViewChecked {
  @ViewChild('tbody', { static: false }) tbody: ElementRef;
  @ViewChildren('trow') rows: Array<ElementRef>;

  public days: Array<string> = [moment().format('ddd D')];
  public startDate: any = moment().set({ hours: 0, minutes: 0, seconds: 0 });
  public timeBlocks: Array<TimeBlock> = [];
  public timerange: 'day' | 'week' = 'week';
  public selectedMeeting = '';
  public clickedMeeting: any;
  public dates: DateNavigatorOutput = {};

  private selectedUser: SelectedAccount;
  private isTableScrolled = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private store: Store<CCRConfig>,
    private schedule: Schedule,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService
  ) {}

  public ngOnDestroy() {
    this.bus.unregister('schedule.table.selected');
    this.bus.unregister('schedule.table.refresh');
  }

  public ngOnInit(): void {
    this.generateTimes([], []);
    this.selectedUser = this.context.selected;
    this.context.selected$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user && this.selectedUser !== user) {
        this.selectedUser = user;
        this.getMeetings(this.dates);
      }
    });

    setTimeout(
      () =>
        this.context.organization$.pipe(untilDestroyed(this)).subscribe(() => {
          this.getMeetings(this.dates);
          // prevents exception when changing timeframe from child component
          this.cdr.detectChanges();
        }),
      500
    );

    // this.bus.trigger('organizations.disable-all');

    this.bus.trigger('right-panel.component.set', 'addConsultation');
    this.bus.trigger('right-panel.consultation.form', {
      form: 'addConsultation',
    });

    this.bus.register('schedule.table.selected', this.setSelected.bind(this));
    this.bus.register('schedule.table.refresh', () => {
      this.getMeetings(this.dates);
    });
  }

  public ngAfterViewChecked(): void {
    if (this.rows.length === 96 && !this.isTableScrolled) {
      const targetElement = this.rows.find(
        (r) => r.nativeElement.className === 'seven-am-row'
      ).nativeElement;
      if (targetElement) {
        this.isTableScrolled = true;
        targetElement.scrollIntoView(true);
      }
    }
  }

  public setSelected(value: string) {
    this.selectedMeeting = value;
  }

  public clickMeeting(meeting: any) {
    this.clickedMeeting = meeting;
    if (this.isUnavailable(meeting)) {
      if (this.futureMeeting(meeting)) {
        this.deleteMeeting();
      }
    } else {
      this.viewMeeting();
    }
  }

  public editMeeting() {
    if (this.selectedMeeting !== this.clickedMeeting.id) {
      // force showing the panel on mobile
      this.store.dispatch(new OpenPanel());
      this.bus.trigger('right-panel.consultation.form', {
        form: 'editConsultation',
        id: this.clickedMeeting.id,
      });
      this.selectedMeeting = this.clickedMeeting.id;
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
              end: moment(this.clickedMeeting.endTime).format('LT'),
            },
            options: [
              {
                viewValue: _('BOARD.DELETE_SINGLE_MEETING'),
                value: 'single',
                color: 'warn',
              },
              {
                viewValue: _('BOARD.DELETE_ALL_MEETINGS'),
                value: 'recurring',
                color: 'warn',
              },
            ],
          },
        })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm === 'recurring') {
            this.doDeleteRecurring();
          } else if (confirm === 'single') {
            this.doDeleteSingle();
          }
        });
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
              end: moment(this.clickedMeeting.endTime).format('LT'),
            },
          },
        })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.doDeleteSingle();
          }
        });
    }
  }

  public viewMeeting() {
    this.dialog.open(ViewMeetingDialog, {
      data: { meeting: this.clickedMeeting },
      width: '80vw',
      panelClass: 'ccr-full-dialog',
      disableClose: true,
    });
  }

  public futureMeeting(meeting: any) {
    return moment(meeting.startTime).isAfter(moment(), 'minutes');
  }

  public calculateTop(meeting: Meeting): number {
    const minutes = meeting.date.minutes() % 15;
    return (minutes * 100) / 15;
  }

  public calculateHeight(meeting: Meeting): number {
    const diff = meeting.endDate.diff(meeting.date, 'minutes');
    return (diff * 24) / 15;
  }

  public selectedDate(dates: DateNavigatorOutput): void {
    this.dates = dates;
    this.getMeetings(this.dates);
    // prevents exception when changing timeframe from child component
    this.cdr.detectChanges();
  }

  private doDeleteRecurring() {
    this.schedule
      .deleteRecurringMeeting(this.clickedMeeting.id)
      .then(() => {
        this.notifier.success(_('NOTIFY.SUCCESS.MEETING_RECURRING_DELETED'));
        this.bus.trigger('schedule.table.refresh');
      })
      .catch((err) => this.notifier.error(err));
  }

  private doDeleteSingle() {
    this.schedule
      .deleteMeeting(this.clickedMeeting.id)
      .then(() => {
        this.notifier.success(
          this.isUnavailable(this.clickedMeeting)
            ? _('NOTIFY.SUCCESS.UNAVAILABILITY_DELETED')
            : _('NOTIFY.SUCCESS.MEETING_DELETED')
        );
        this.bus.trigger('schedule.table.refresh');
      })
      .catch((err) => this.notifier.error(err));
  }

  private generateTimes(
    meetings: Meeting[],
    availabilities: FetchCalendarAvailabilitySegment[]
  ): void {
    this.timeBlocks.length = 0;

    let startDate = !isEmpty(this.dates)
      ? moment(this.dates.startDate)
      : this.startDate.clone();

    // so that we can offset all the dates to that year, ignoring DST
    const dayDiff = Math.abs(
      startDate.diff(moment().set('year', 1900), 'days')
    );
    startDate = startDate.subtract(dayDiff, 'days').startOf('day');

    while (this.timeBlocks.length < 96) {
      const time =
        this.timeBlocks.length === 0
          ? startDate.toDate()
          : moment(this.timeBlocks[this.timeBlocks.length - 1].time)
              .add(15, 'minutes')
              .toDate();

      const block = {
        display: moment(time).format('h:mm A'),
        duration: 15,
        time: time,
        cells: new Array<{
          isAvailable: boolean;
          meeting: Meeting;
        }>(),
      };

      for (let i = 0; i < (this.timerange === 'day' ? 1 : 7); ++i) {
        block.cells.push({
          isAvailable: availabilities.some((segment) => {
            const targetTime = moment(time).add(i, 'days');
            const startTime = moment(segment.startTime).subtract(
              dayDiff,
              'days'
            );
            const endTime = moment(segment.endTime).subtract(dayDiff, 'days');

            return (
              targetTime.isBetween(startTime, endTime, null, '[]') &&
              targetTime
                .add(15, 'minutes')
                .isBetween(startTime, endTime, null, '[]')
            );
          }),
          meeting: null,
        });
      }

      meetings.forEach((meeting) => {
        const minuteDiff = meeting.date.minutes() - moment(time).minutes();
        if (
          meeting.date.hour() === moment(time).hour() &&
          minuteDiff >= 0 &&
          minuteDiff < 15
        ) {
          const index = this.days.findIndex(
            (day) => day === meeting.date.format('ddd D')
          );
          if (index > -1) {
            block.cells[index].meeting = meeting;
          }
        }
      });
      this.timeBlocks.push(block);
    }
  }

  private getMeetings(date: DateNavigatorOutput) {
    if (!this.selectedUser || !date) {
      return;
    }

    this.days =
      this.timerange === 'day'
        ? [moment(date.startDate).format('ddd D')]
        : Array.from(Array(7), (t, i) =>
            moment(date.startDate).add(i, 'day').format('ddd D')
          );

    const start = moment(date.startDate).startOf('day').toISOString();
    const end = moment(date.endDate).endOf('day').toISOString();

    const availableRequest = {
      startTime: start,
      endTime: end,
      providers: [this.selectedUser.id],
    };

    const meetingRequest: FetchAllMeetingRequest = {
      organization: this.context.organizationId,
      range: {
        start,
        end,
      },
      account: this.selectedUser.id,
      limit: 'all',
    };

    Promise.all([
      this.schedule.fetchCalendarAvailability(availableRequest),
      this.schedule.fetchAllMeeting(meetingRequest),
    ])
      .then(([availableResponse, meetingResponse]) => {
        const cleanResponse = meetingResponse.data.map((m) => new Meeting(m));
        const meetings = new Array<Meeting>();
        cleanResponse.forEach((m) => {
          if (m.date.day() === m.endDate.day()) {
            const meeting = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m),
              organizationHierarchy:
                typeof m.organization.hierarchy === 'string' ||
                (m.organization.hierarchy as any) instanceof String
                  ? JSON.parse(m.organization.hierarchy.toString())
                  : m.organization.hierarchy,
            };
            meetings.push(meeting);
          } else {
            const startMeeting: any = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m),
            };
            const endMeeting: any = {
              ...m,
              timeToDisplay: this.timeToDisplay(m),
              selectable: this.selectableMeeting(m),
            };

            startMeeting.endTime = startMeeting.date
              .hours(24)
              .minutes(0)
              .toISOString();
            endMeeting.startTime = startMeeting.endDate
              .startOf('day')
              .toISOString();

            meetings.push(startMeeting);
            meetings.push(endMeeting);
          }
        });
        this.generateTimes(meetings, availableResponse.entries);
      })
      .catch((err) => this.notifier.error(err));
  }

  private isUnavailable(meeting: any) {
    return meeting.type.id === 4;
  }

  private selectableMeeting(meeting: any) {
    return this.futureMeeting(meeting);
  }

  private timeToDisplay(meeting: Meeting) {
    const start = meeting.date.format('h:mm');
    const end = meeting.endDate.format('h:mma');
    return `${start}-${end}`;
  }
}
