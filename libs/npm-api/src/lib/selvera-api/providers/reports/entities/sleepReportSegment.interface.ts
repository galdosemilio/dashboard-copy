/**
 * Interface for /warehouse/sleep/basic
 */

import { ReportAccount, ReportOrganization } from '../../common/entities'
import { HoursSlept } from './hoursSlept.interface'

export interface SleepReportSegment {
  account: ReportAccount
  organization: ReportOrganization
  date: string
  hoursSlept: HoursSlept
  assignedProvider: ReportAccount
}
