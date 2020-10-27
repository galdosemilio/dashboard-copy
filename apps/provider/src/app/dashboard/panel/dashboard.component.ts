import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';

import { DietersDatabase, DietersDataSource } from '@app/dashboard/accounts';
import { AlertsDatabase, AlertsDataSource } from '@app/dashboard/alerts';
import {
  ReportsDatabase,
  SignupsReportsDataSource
} from '@app/dashboard/reports/services';
import {
  ConfigService,
  ContextService,
  EventsService,
  NotifierService,
  WalkthroughService
} from '@app/service';
import { _, ViewUtils } from '@app/shared';

@Component({
  selector: 'app-dashboard-panel',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnDestroy, OnInit {
  recentsSource: DietersDataSource;
  alertsSource: AlertsDataSource;
  signupSource: SignupsReportsDataSource;

  canViewAll: boolean = true;
  canAccessPhi: boolean = true;

  constructor(
    private notifier: NotifierService,
    private dietersDatabase: DietersDatabase,
    private alertsDatabase: AlertsDatabase,
    private signupsDatabase: ReportsDatabase,
    private config: ConfigService,
    private context: ContextService,
    private bus: EventsService,
    private translator: TranslateService,
    private viewUtils: ViewUtils,
    private walkthrough: WalkthroughService
  ) {}

  ngOnInit() {
    this.walkthrough.checkGuideState('dashboard');
    // this.bus.trigger('organizations.enable-all');
    this.bus.trigger('right-panel.component.set', 'notifications');

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.canAccessPhi = org && org.permissions ? org.permissions.allowClientPhi : false;
      this.canViewAll = org && org.permissions ? org.permissions.viewAll : false;
    });

    const errorHandler = function (err) {
      switch (err) {
        case 'You do not have proper permission to access this endpoint':
          this.addError(_('NOTIFY.ERROR.NO_PATIENT_LISTING_PERMISSION'));
          break;
        default:
          this.addError(err);
      }
    };

    // setup the recent registries table
    this.recentsSource = new DietersDataSource(this.notifier, this.dietersDatabase);
    this.recentsSource.showEmpty = false;
    this.recentsSource.errorHandler = errorHandler;
    this.recentsSource.addDefault({
      pageSize: 5,
      offset: 0,
      sort: [
        {
          property: 'associationDate',
          dir: 'desc'
        }
      ]
    });
    this.recentsSource.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId
    }));

    // setup the alerts source
    this.alertsSource = new AlertsDataSource(
      this.notifier,
      this.alertsDatabase,
      this.context,
      this.translator
    );
    this.alertsSource.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId,
      account: this.context.user.id,
      viewed: false,
      limit: 6,
      offset: 0
    }));

    this.signupSource = new SignupsReportsDataSource(
      this.notifier,
      this.signupsDatabase,
      this.translator,
      this.config,
      this.viewUtils
    );

    this.signupSource.addRequired(this.context.organization$, () => ({
      organization: this.context.organizationId,
      startDate: moment().startOf('day').subtract(4, 'days').format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      unit: 'day'
    }));
  }

  ngOnDestroy() {
    this.recentsSource.disconnect();
    this.alertsSource.disconnect();
  }
}
