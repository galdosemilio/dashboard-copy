/**
 * PATCH /notification/viewed/:notificationId/:account
 */

export interface ToggleOneAlertsRequest {
  /** Account ID, Current account Id for Client. */
  account: string;
  /** Notification ID. */
  notificationId: string;
  /** A flag indicating whether the notification should be treated as seen or unseen. */
  isViewed: boolean;
}
