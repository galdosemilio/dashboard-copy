import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { findIndex } from 'lodash';
import { Subject } from 'rxjs';

import { ContextService, EventsService, NotifierService } from '@app/service';
import { _, CcrPaginator } from '@app/shared';
import { AlertsDatabase, AlertsDataSource, AlertTypesDataSource } from './services';

@Component({
  selector: 'app-reports-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [AlertsDataSource]
})
export class AlertsComponent implements OnInit, OnDestroy {
  @ViewChild(CcrPaginator, { static: true })
  paginator: CcrPaginator;
  source: AlertsDataSource;

  alert: string;
  alerts = [
    { viewValue: _('REPORTS.CLEAR_FILTER'), value: undefined },
    { viewValue: _('REPORTS.TYPE_MEASUREMENTS'), value: '1' },
    { viewValue: _('REPORTS.TYPE_INACTIVITY'), value: 2 },
    { viewValue: _('REPORTS.TYPE_WEIGHT_THRESHOLD'), value: '5' }
  ];

  constructor(
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: AlertsDatabase
  ) {}

  // refresh chart trigger
  refresh$ = new Subject<boolean>();

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate');

    this.source = new AlertsDataSource(
      this.notifier,
      this.database,
      this.context,
      this.translator
    );
    // setup the table source
    this.source.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id,
      viewed: false
    }));
    this.source.addOptional(this.refresh$, () => {
      const k = findIndex(this.alerts, { value: this.alert });
      console.log({ alerts: this.alerts, alert: this.alert });
      return k === 0
        ? {}
        : typeof this.alert === 'string'
        ? { type: this.alert }
        : { category: this.alert };
    });
    this.source.addOptional(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id
    }));
    this.source.addOptional(this.paginator.page, () => ({
      limit: this.paginator.pageSize || 12,
      offset: this.paginator.pageIndex * (this.paginator.pageSize || 12)
    }));
  }

  ngOnDestroy() {
    this.source.disconnect();
  }

  refresh() {
    this.paginator.pageIndex = 0;
    this.refresh$.next(true);
  }
}
