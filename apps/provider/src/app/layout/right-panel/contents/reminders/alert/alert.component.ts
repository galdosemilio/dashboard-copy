import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alerts } from 'selvera-api';

import { ContextService, NotifierService } from '@app/service';
import {
  NotificationToggleRequest,
  ToggleGroupAlertsRequest
} from '@app/shared/selvera-api';

@Component({
  selector: 'app-rightpanel-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class SideAlertsComponent {
  @Input()
  alert;

  @Output()
  dismissed = new EventEmitter<void>();

  constructor(
    private alerts: Alerts,
    private context: ContextService,
    private notifier: NotifierService
  ) {}

  onDismiss(alert): void {
    const requests = alert.ids.map((id) => {
      const req: NotificationToggleRequest = {
        account: this.context.user.id,
        notificationId: id,
        isViewed: true
      };

      return this.alerts.toggleNotification(req);
    });

    Promise.all(requests)
      .then(() => {
        this.dismissed.next();
      })
      .catch((err) => this.notifier.error(err));
  }

  onDismissAll(alert): void {
    const requests = alert.groupIds.map((id) => {
      const req: ToggleGroupAlertsRequest = {
        organization: this.context.organizationId,
        groupId: id,
        isViewed: true
      };

      return this.alerts.toggleGroup(req);
    });

    Promise.all(requests)
      .then(() => {
        this.dismissed.next();
      })
      .catch((err) => this.notifier.error(err));
  }
}
