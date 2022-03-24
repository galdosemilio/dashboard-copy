import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { findIndex } from 'lodash'
import { Subject } from 'rxjs'

import { ContextService, EventsService, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { AlertsDatabase, AlertsDataSource } from './services'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-reports-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [AlertsDataSource]
})
export class AlertsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  source: AlertsDataSource

  alert: string
  alerts = [
    { viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined },
    { viewValue: _('REPORTS.TYPE_MEASUREMENTS'), value: '1' },
    { viewValue: _('REPORTS.TYPE_INACTIVITY'), value: 2 },
    { viewValue: _('REPORTS.TYPE_WEIGHT_THRESHOLD'), value: '5' }
  ]
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020577952-Viewing-Notifications-in-the-Dashboard'

  constructor(
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: AlertsDatabase
  ) {}

  // refresh chart trigger
  refresh$ = new Subject<boolean>()

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')

    this.source = new AlertsDataSource(
      this.notifier,
      this.database,
      this.context,
      this.translator
    )
    // setup the table source
    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id,
      viewed: false
    }))
    this.source.addOptional(this.refresh$.pipe(debounceTime(300)), () => {
      const k = findIndex(this.alerts, { value: this.alert })

      return k === 0
        ? {}
        : typeof this.alert === 'string'
        ? { type: this.alert }
        : { category: this.alert }
    })
    this.source.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id
    }))
    this.source.addOptional(this.paginator.page, () => ({
      limit: this.paginator.pageSize || 12,
      offset: this.paginator.pageIndex * (this.paginator.pageSize || 12)
    }))
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  refresh() {
    this.paginator.pageIndex = 0
    this.refresh$.next(true)
  }
}
