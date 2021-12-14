import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Alerts } from '@coachcare/sdk'

import { ContextService, NotifierService } from '@app/service'
import {
  NotificationToggleRequest,
  ToggleGroupAlertsRequest
} from '@coachcare/sdk'
import { first } from 'rxjs/operators'
import { AlertNotification } from '../models'
import {
  AlertsDatabase,
  AlertsDataSource,
  AlertTypesDataSource,
  AlertTypesPreference
} from '../services'

@UntilDestroy()
@Component({
  selector: 'app-alerts-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class AlertsTableComponent implements OnDestroy, OnInit {
  @Input()
  columns = ['name', 'type', 'notice', 'date', 'actions']
  @Input()
  source: AlertsDataSource

  private alertTypes: AlertTypesPreference[] = []
  canAccessPhi = true
  canViewAll = true

  constructor(
    private router: Router,
    private alerts: Alerts,
    private alertsDatabase: AlertsDatabase,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      this.canAccessPhi =
        org && org.permissions ? org.permissions.allowClientPhi : false
      this.canViewAll = org && org.permissions ? org.permissions.viewAll : false
      void this.fetchAlertTypes()
    })
  }

  ngOnDestroy() {}

  public getAlertTypeName(alertNotification: AlertNotification): string {
    const foundAlertType = this.alertTypes.find(
      (alertType) => alertType.typeCode === alertNotification.alertCode
    )

    return foundAlertType && foundAlertType.texts
      ? foundAlertType.texts.title
      : alertNotification.alertDescription
  }

  showDieter(account: any, openInNew: boolean = false): void {
    if (openInNew) {
      const routeQuery = window.location.href.split('?')[1]
      window.open(
        `./accounts/patients/${account.id}${
          routeQuery ? '?' + routeQuery : ''
        }`,
        '_blank'
      )
    } else {
      account.accountType = '3'
      void this.router.navigate([this.context.getProfileRoute(account)])
    }
  }

  onDismiss(row) {
    const req: NotificationToggleRequest = {
      account: this.context.user.id,
      notificationId: row.id,
      isViewed: true
    }
    this.alerts
      .toggleNotification(req)
      .then(() => {
        // this.notifier.success(_('NOTIFY.SUCCESS.NOTIFICATION_DISMISSED'));
        this.source.refresh()
      })
      .catch((err) => this.notifier.error(err))
  }

  onDismissForAll(row) {
    const req: ToggleGroupAlertsRequest = {
      organization: this.context.organizationId,
      groupId: row.groupId,
      isViewed: true
    }
    this.alerts
      .toggleGroup(req)
      .then(() => {
        // this.notifier.success(_('NOTIFY.SUCCESS.NOTIFICATION_DISMISSED'));
        this.source.refresh()
      })
      .catch((err) => this.notifier.error(err))
  }

  private async fetchAlertTypes(): Promise<void> {
    try {
      const source = new AlertTypesDataSource(
        this.notifier,
        this.alertsDatabase,
        this.context
      )
      source.addDefault({
        organization: this.context.organizationId,
        limit: 'all'
      })
      this.alertTypes = await source.connect().pipe(first()).toPromise()
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
