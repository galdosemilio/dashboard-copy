/**
 * PATCH /notification/viewed/group/:groupId
 */

export interface ToggleGroupAlertsRequest {
  /** Notification group ID. */
  groupId: string;
  /** Organization ID. */
  organization: string;
  /** A flag indicating whether all notifications in the notification group should be treated as seen or unseen by their recipients. */
  isViewed: boolean;
}
