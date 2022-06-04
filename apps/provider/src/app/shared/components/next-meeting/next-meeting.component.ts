import { Component, OnDestroy, OnInit } from '@angular/core'
import { BILLABLE_SERVICES } from '@app/dashboard/reports/communications/models'
import {
  CcrCallWaitingRoomComponent,
  CcrCallWaitingRoomProps
} from '@app/layout/call/call-waiting-room'
import { callSelector, CallState } from '@app/layout/store/call'
import { ContextService, NotifierService } from '@app/service'
import { AttendeeEntity, Meeting } from '@app/shared'
import {
  MeetingsDatabase,
  MeetingsDataSource
} from '@app/shared/components/schedule'
import { MatDialog } from '@coachcare/material'
import { AccountType } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { sortBy } from 'lodash'
import * as moment from 'moment'
import { first } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-next-meeting',
  templateUrl: './next-meeting.component.html',
  styleUrls: ['./next-meeting.component.scss']
})
export class CcrNextMeetingComponent implements OnDestroy, OnInit {
  public attendeeEntities: AttendeeEntity[] = []
  /**
   * TODO
   * We need to make sure that this variable is false if there's
   * an active call so that we don't clog the app with media sources.
   */
  public defaultBillableService = BILLABLE_SERVICES.none
  public isProvider = false
  public upcomingMeetings: Meeting[] = []
  public canJoinSession: { [meetingId: string]: boolean } = {}

  private dataSource: MeetingsDataSource
  private hasOngoingCall = false
  private joinStatusInterval? = null

  constructor(
    private context: ContextService,
    private dialog: MatDialog,
    private database: MeetingsDatabase,
    private notifier: NotifierService,
    private store: Store<CallState>
  ) {
    this.checkJoinStatus = this.checkJoinStatus.bind(this)
  }

  public ngOnDestroy(): void {
    this.stopJoinStatusInterval()
  }

  public ngOnInit(): void {
    this.isProvider = this.context.isProvider
    this.createMeetingsSource()
    void this.fetchMeetings()

    this.store
      .select(callSelector)
      .pipe(untilDestroyed(this))
      .subscribe((callState) => (this.hasOngoingCall = callState.isCallStarted))
  }

  public joinSession(meeting: Meeting): void {
    this.showCallWaitingRoom(meeting)
  }

  private checkJoinStatus(): void {
    this.upcomingMeetings.forEach((meeting) => {
      this.canJoinSession[meeting.id] = this.hasOngoingCall
        ? false
        : meeting.date.clone().subtract(15, 'minutes').isSameOrBefore(moment())
    })

    this.checkMeetingDurationStatus()
  }

  private checkMeetingDurationStatus(): void {
    const endedMeetings = this.upcomingMeetings.filter((meeting) =>
      meeting.endDate.isSameOrBefore(moment())
    )

    if (endedMeetings.length) {
      void this.fetchMeetings()
    }
  }

  private createMeetingsSource(): void {
    const today = moment()
    this.dataSource = new MeetingsDataSource(this.database)
    this.dataSource.addDefault({
      account: this.context.user.id,
      organization: this.context.organization.id,
      range: {
        start: today.toISOString(),
        end: today.endOf('year').toISOString()
      },
      limit: 3
    })
  }

  private async fetchMeetings(): Promise<void> {
    try {
      this.dataSource
        .connect()
        .pipe(first())
        .subscribe((meetings) => this.processUpcomingMeetings(meetings))
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private processUpcomingMeetings(meetings: Meeting[]): void {
    this.upcomingMeetings = meetings

    if (!meetings.length) {
      this.stopJoinStatusInterval()
      return
    }

    this.startJoinStatusInterval()
  }

  public isProviderAttendee(attendee): boolean {
    return Number(attendee.accountType?.id) === AccountType.Provider
  }

  public attendeeName(attendee): string {
    return `${attendee.firstName} ${attendee.lastName}`
  }

  public callTargets(meeting: Meeting) {
    return [
      meeting.attendees
        .filter((attendee) => attendee.id !== this.context.user.id)
        .pop()
    ]
  }

  private showCallWaitingRoom(meeting: Meeting): void {
    const attendeeEntities = sortBy(
      meeting.attendees,
      (attendee) => attendee.accountType.id,
      ['desc']
    ).map((attendee) => ({
      id: attendee.id,
      isProvider: Number(attendee.accountType.id) === AccountType.Provider,
      name: `${attendee.firstName} ${attendee.lastName}`
    }))

    try {
      const data: CcrCallWaitingRoomProps = {
        attendeeEntities
      }
      this.canJoinSession[meeting.id] = false
      this.dialog
        .open(CcrCallWaitingRoomComponent, {
          data,
          panelClass: 'ccr-fullscreen-dialog',
          disableClose: true
        })
        .afterClosed()
        .subscribe(() => this.startJoinStatusInterval())

      this.stopJoinStatusInterval()
    } catch (error) {
    } finally {
      this.canJoinSession[meeting.id] = true
    }
  }

  private startJoinStatusInterval(): void {
    if (this.joinStatusInterval !== null) {
      return
    }

    this.joinStatusInterval = setInterval(this.checkJoinStatus, 1000)
  }

  private stopJoinStatusInterval(): void {
    if (this.joinStatusInterval === null) {
      return
    }

    clearInterval(this.joinStatusInterval)
  }
}
