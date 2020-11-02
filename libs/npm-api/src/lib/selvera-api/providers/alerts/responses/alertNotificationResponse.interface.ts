/**
 * Interface for Notifications
 */

import { PaginationResponse } from '../../common/entities'
import { AlertNotification } from '../entities'

export interface AlertNotificationResponse {
  data: Array<AlertNotification>
  pagination: PaginationResponse
}
