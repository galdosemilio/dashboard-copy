import { Injectable } from '@angular/core'
import { from, Observable } from 'rxjs'

import { CcrDatabase } from '@app/shared/model'
import {
  Alerts,
  AlertNotificationResponse,
  AlertPreferenceResponse,
  AlertTypesResponse,
  FetchAlertPreferenceRequest,
  FetchAlertTypesRequest,
  NotificationRequest
} from '@coachcare/sdk'

@Injectable()
export class AlertsDatabase extends CcrDatabase {
  constructor(private alerts: Alerts) {
    super()
  }

  fetchNotifications(
    args: NotificationRequest
  ): Observable<AlertNotificationResponse> {
    return from(this.alerts.fetchNotifications(args))
  }

  fetchAlertPreference(
    args: FetchAlertPreferenceRequest
  ): Promise<AlertPreferenceResponse> {
    return this.alerts.fetchAlertPreference(args)
  }

  fetchAlertTypes(): Promise<AlertTypesResponse> {
    const req: FetchAlertTypesRequest = { limit: 'all' }
    return this.alerts.fetchAlertTypes(req)
  }
}
