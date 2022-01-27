import { Component, OnDestroy, OnInit } from '@angular/core'
import { ClosePanel, UILayoutState } from '@app/layout/store/layout'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { Meeting } from '@app/shared/model/meeting'
import { MatDialog } from '@coachcare/material'
import { PackageEnrollment, Schedule } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import * as moment from 'moment'
import { environment } from 'apps/provider/src/environments/environment'
import { PromptDialog, _ } from '@app/shared'
import { filter } from 'rxjs/operators'
@Component({
  selector: 'ccr-schedule-mosaic',
  templateUrl: './schedule-mosaic.component.html',
  host: { class: 'wellcore-component' }
})
export class ScheduleMosaicComponent implements OnDestroy, OnInit {
  public isLoading = false
  public nextMeetings: Meeting[] = []
  public pastMeetings: Meeting[] = []
  public eligibleToSelfSchedule = true

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private packageEnrollment: PackageEnrollment,
    private schedule: Schedule,
    private store: Store<UILayoutState>
  ) {}

  public ngOnDestroy(): void {
    this.bus.unregister('schedule.table.refresh')
  }

  public ngOnInit(): void {
    void this.fetchMeetings()
    this.store.dispatch(new ClosePanel())
    this.bus.trigger('right-panel.component.set', 'addConsultation')
    this.bus.trigger('right-panel.consultation.form', {
      form: 'addConsultation'
    })
    this.bus.register('schedule.table.refresh', () => {
      void this.fetchMeetings()
    })
  }

  public showCancelMeetingDialog(meeting: Meeting): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.DELETE_MEETING'),
          content: _('BOARD.DELETE_MEETING_CONFIRM'),
          contentParams: {
            date: meeting.date.format('dddd, MMMM DD, YYYY'),
            start: meeting.date.format('h:mm a'),
            end: meeting.endDate.format('h:mm a')
          }
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => void this.attemptDeleteMeeting(meeting))
  }

  private async attemptDeleteMeeting(meeting: Meeting): Promise<void> {
    try {
      await this.schedule.deleteMeeting(meeting.id)
      this.notifier.success(_('NOTIFY.SUCCESS.MEETING_DELETED'))
    } catch (error) {
      this.notifier.error(error)
    } finally {
      void this.fetchMeetings()
    }
  }

  private async fetchMeetings(): Promise<void> {
    try {
      this.isLoading = true
      const pastMeetings = await this.schedule.fetchAllMeeting({
        limit: 3,
        organization: this.context.organizationId,
        range: {
          start: moment().startOf('month').toISOString(),
          end: moment().toISOString()
        },
        sort: [
          {
            property: 'start',
            dir: 'desc'
          }
        ]
      })

      const nextMeetings = await this.schedule.fetchAllMeeting({
        limit: 2,
        organization: this.context.organizationId,
        range: {
          start: moment().toISOString(),
          end: moment().add(1, 'year').endOf('year').toISOString()
        }
      })

      this.pastMeetings = pastMeetings.data
        .map((meeting) => new Meeting(meeting))
        .filter((meeting) => moment().isSameOrAfter(meeting.endDate))

      this.nextMeetings = nextMeetings.data.map(
        (meeting) => new Meeting(meeting)
      )

      this.eligibleToSelfSchedule = await this.getSelfSchedulingEligibility()
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private async getSelfSchedulingEligibility(): Promise<boolean> {
    const res = await this.packageEnrollment.getAll({
      organization: this.context.organizationId,
      limit: 1,
      account: this.context.user.id,
      isActive: true,
      package: environment.wellcoreEligibleToSelfSchedulePhaseId
    })

    return res.data[0]?.isActive === true
  }
}
