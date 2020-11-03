/**
 * Interface for Notification Toggle Request
 */

export interface NotificationToggleRequest {
    account: string;
    notificationId: string;
    isViewed: boolean;
}
