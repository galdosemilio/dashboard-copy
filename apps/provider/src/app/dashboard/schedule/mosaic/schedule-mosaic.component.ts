import { Component, OnDestroy, OnInit } from '@angular/core'
import { ClosePanel, UILayoutState } from '@app/layout/store/layout'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { Meeting } from '@app/shared/model/meeting'
import { Schedule } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import * as moment from 'moment'

@Component({
  selector: 'ccr-schedule-mosaic',
  templateUrl: './schedule-mosaic.component.html',
  host: { class: 'wellcore-component' }
})
export class ScheduleMosaicComponent implements OnDestroy, OnInit {
  public isLoading = false
  public nextMeetings: Meeting[] = []
  public pastMeetings: Meeting[] = []

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private notifier: NotifierService,
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
      this.fetchMeetings()
    })
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

      this.pastMeetings = pastMeetings.data.map(
        (meeting) => new Meeting(meeting)
      )

      this.nextMeetings = nextMeetings.data.map(
        (meeting) => new Meeting(meeting)
      )
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
