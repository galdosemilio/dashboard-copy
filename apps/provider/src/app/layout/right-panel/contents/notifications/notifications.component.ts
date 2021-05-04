import { Component, OnInit } from '@angular/core'
import * as moment from 'moment-timezone'

import { NotificationsDataService } from '@app/layout/right-panel/services'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { FetchAllMeetingRequest } from '@coachcare/sdk'

@Component({
  selector: 'app-rightpanel-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  dateSections: Array<any> = []
  isLoading = true

  constructor(
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private dataService: NotificationsDataService
  ) {}

  ngOnInit() {
    this.getMeetings()
  }

  private getMeetings(): void {
    const request: FetchAllMeetingRequest = {
      organization: this.context.organizationId,
      account: this.context.user.id,
      range: {
        start: moment().toISOString(),
        end: moment().endOf('year').toISOString()
      }
    }
    this.dataService
      .getMeetings(request)
      .then((res) => {
        this.dateSections = this.dataService.groupByDate(
          res,
          null,
          this.config.get('app.limit.notifications', 12)
        )
        this.isLoading = false
      })
      .catch((err) => this.notifier.error(err))
  }
}
