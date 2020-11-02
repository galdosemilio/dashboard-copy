/**
 * Interface for Notifications
 */

import {
  NotificationAccount,
  NotificationOrganization
} from '../../common/entities'
import { NotificationTypeDetailed } from '../entities'

export interface AlertNotification {
  id: string
  type: NotificationTypeDetailed
  organization: NotificationOrganization
  recipient: NotificationAccount
  triggeredBy?: NotificationAccount
  createdAt: string
  viewed: boolean
  payload?: any
  groupId?: string
}
