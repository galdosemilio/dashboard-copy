/**
 * Interface for Notification Description
 */

import { NotificationType } from '../../common/entities'

export interface NotificationDescription extends NotificationType {
  description: string
}
