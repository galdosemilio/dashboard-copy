/**
 * Interface for Notification Organization
 */

import { ReportOrganization } from './reportOrganization'

export interface NotificationOrganization extends ReportOrganization {
  shortcode: string
  hierarchyPath: Array<string>
}
