/**
 * PATCH /notification/viewed/group/:groupId
 */

export interface ToggleGroupAlertsRequest {
    /** Organization ID */
    organization: string;
    /** Notification group ID. */
    groupId: string;
    /** A flag indicating whether all notifications in the notification group should be treated as seen or unseen by their recipients. */
    isViewed: boolean;
}
