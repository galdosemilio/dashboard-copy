import { Component, OnDestroy, OnInit } from '@angular/core'
import {
  CcrCallWaitingRoomComponent,
  CcrCallWaitingRoomProps
} from '@app/layout/call/call-waiting-room'
import { callSelector, CallState } from '@app/layout/store/call'
import { ContextService, NotifierService } from '@app/service'
import { Meeting } from '@app/shared'
import {
  MeetingsDatabase,
  MeetingsDataSource
} from '@app/shared/components/schedule'
import { MatDialog } from '@coachcare/material'
import { NamedEntity } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import * as moment from 'moment'
import { first } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-next-meeting',
  templateUrl: './next-meeting.component.html',
  styleUrls: ['./next-meeting.component.scss']
})
export class CcrNextMeetingComponent implements OnDestroy, OnInit {
  public attendeeEntities: NamedEntity[] = []
  /**
   * TODO
   * We need to make sure that this variable is false if there's
   * an active call so that we don't clog the app with media sources.
   */
  public canJoinSession = false
  public upcomingMeeting?: Meeting

  private dataSource: MeetingsDataSource
  private hasOngoingCall = false
  private joinStatusInterval?: number = null

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
    this.createMeetingsSource()
    void this.fetchMeetings()

    this.store
      .select(callSelector)
      .pipe(untilDestroyed(this))
      .subscribe((callState) => (this.hasOngoingCall = callState.isCallStarted))
  }

  public joinSession(): void {
    this.showCallWaitingRoom()
  }

  private checkJoinStatus(): void {
    this.canJoinSession = this.hasOngoingCall
      ? false
      : this.upcomingMeeting.date.isSameOrBefore(moment())
    this.checkMeetingDurationStatus()
  }

  private checkMeetingDurationStatus(): void {
    if (this.upcomingMeeting.endDate.isSameOrBefore(moment())) {
      void this.fetchMeetings()
    }
  }

  private createMeetingsSource(): void {
    const today = moment()
    this.dataSource = new MeetingsDataSource(this.database)
    this.dataSource.addDefault({
      organization: this.context.organization.id,
      range: {
        start: today.toISOString(),
        end: today.endOf('year').toISOString()
      },
      limit: 1
    })
  }

  private async fetchMeetings(): Promise<void> {
    try {
      this.dataSource
        .connect()
        .pipe(first())
        .subscribe((meetings) =>
          this.processUpcomingMeeting(meetings.length ? meetings.pop() : null)
        )
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private processUpcomingMeeting(meeting: Meeting | null): void {
    this.upcomingMeeting = meeting

    if (!meeting) {
      this.stopJoinStatusInterval()
      return
    }

    this.attendeeEntities = meeting.attendees.map((attendee) => ({
      id: attendee.id,
      name: `${attendee.firstName} ${attendee.lastName[0]}.`
    }))

    this.startJoinStatusInterval()
  }

  private showCallWaitingRoom(): void {
    try {
      const data: CcrCallWaitingRoomProps = {
        attendeeEntities: this.attendeeEntities
      }
      this.canJoinSession = false
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
      this.canJoinSession = true
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
