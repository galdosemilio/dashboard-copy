/**
 * Interface for Notification Description
 */

import { NotificationType } from '../../common/entities'

export interface NotificationTypeDetailed extends NotificationType {
  id: string
  code: string
  description: string
}
