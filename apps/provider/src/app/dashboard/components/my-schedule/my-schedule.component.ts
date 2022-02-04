import { Component, OnInit } from '@angular/core'
import { ContextService } from '@app/service'
import { _ } from '@app/shared'
import { NotifierService } from '@coachcare/common/services'
import { Schedule } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import * as moment from 'moment'
import { combineLatest } from 'rxjs'

enum ScheduleType {
  LastConsultation = 1,
  NextConsultation = 2,
  LastBloodText = 3
}

@UntilDestroy()
@Component({
  selector: 'ccr-my-schedule',
  templateUrl: './my-schedule.component.html',
  styleUrls: ['./my-schedule.component.scss']
})
export class MyScheduleComponent implements OnInit {
  columns = ['name', 'date']
  defaultSource = []
  source = []
  isLoading = false
  constructor(
    private context: ContextService,
    private schedule: Schedule,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.defaultSource = [
      {
        name: _('MY_SCHEDULE.LAST_CONSULTATION'),
        date: null,
        type: ScheduleType.LastConsultation
      },
      {
        name: _('MY_SCHEDULE.NEXT_CONSULTATION'),
        date: null,
        type: ScheduleType.NextConsultation
      },
      {
        name: _('MY_SCHEDULE.LAST_BLOOD_TEST'),
        date: null,
        type: ScheduleType.LastBloodText
      }
    ]

    combineLatest([this.context.account$, this.context.organization$])
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        void this.initSource()
      })
  }

  private async initSource(): Promise<void> {
    this.isLoading = true
    this.source = this.defaultSource

    const now = moment.utc()

    const lastConsultationItem = this.source.find(
      (schedule) => schedule.type === ScheduleType.LastConsultation
    )
    const nextConsultationItem = this.source.find(
      (schedule) => schedule.type === ScheduleType.NextConsultation
    )

    try {
      const past = await this.schedule.fetchAllMeeting({
        organization: this.context.organizationId,
        account: this.context.accountId,
        range: {
          start: now.clone().subtract(4, 'years').toISOString(),
          end: now.toISOString()
        },
        limit: 1,
        sort: [
          {
            property: 'start',
            dir: 'desc'
          }
        ]
      })

      if (past.data.length && lastConsultationItem) {
        lastConsultationItem.date = moment.utc(past.data[0].start.utc).toDate()
      }

      const upcoming = await this.schedule.fetchAllMeeting({
        organization: this.context.organizationId,
        account: this.context.accountId,
        range: {
          start: now.toISOString(),
          end: now.clone().add(1, 'years').toISOString()
        },
        sort: [
          {
            property: 'end',
            dir: 'asc'
          }
        ],
        limit: 1
      })

      if (upcoming.data.length && nextConsultationItem) {
        nextConsultationItem.date = moment
          .utc(upcoming.data[0].start.utc)
          .toDate()
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
