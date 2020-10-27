import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Alerts } from 'selvera-api';

import { ContextService, NotifierService } from '@app/service';
import {
  NotificationToggleRequest,
  ToggleGroupAlertsRequest
} from '@app/shared/selvera-api';
import { AlertsDataSource } from '../services';

@Component({
  selector: 'app-alerts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class AlertsTableComponent implements OnDestroy, OnInit {
  @Input()
  columns = ['name', 'type', 'date', 'actions'];
  @Input()
  source: AlertsDataSource;

  canAccessPhi: boolean = true;
  canViewAll: boolean = true;

  constructor(
    private router: Router,
    private alerts: Alerts,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.canAccessPhi = org && org.permissions ? org.permissions.allowClientPhi : false;
      this.canViewAll = org && org.permissions ? org.permissions.viewAll : false;
    });
  }

  ngOnDestroy() {}

  showDieter(account: any): void {
    account.accountType = '3';
    this.router.navigate([this.context.getProfileRoute(account)]);
  }

  onDismiss(row) {
    const req: NotificationToggleRequest = {
      account: this.context.user.id,
      notificationId: row.id,
      isViewed: true
    };
    this.alerts
      .toggleNotification(req)
      .then(() => {
        // this.notifier.success(_('NOTIFY.SUCCESS.NOTIFICATION_DISMISSED'));
        this.source.refresh();
      })
      .catch((err) => this.notifier.error(err));
  }

  onDismissForAll(row) {
    const req: ToggleGroupAlertsRequest = {
      organization: this.context.organizationId,
      groupId: row.groupId,
      isViewed: true
    };
    this.alerts
      .toggleGroup(req)
      .then(() => {
        // this.notifier.success(_('NOTIFY.SUCCESS.NOTIFICATION_DISMISSED'));
        this.source.refresh();
      })
      .catch((err) => this.notifier.error(err));
  }
}
