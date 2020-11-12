/**
 * Interface for Notification Account
 */

import { ReportAccount } from './reportAccount'

export interface NotificationAccount extends ReportAccount {
  email: string
  accountType: string
}
