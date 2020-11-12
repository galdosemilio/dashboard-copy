/**
 * Interface for GET /warehouse/weight/change (response)
 */

import { ReportAccount, ReportOrganization } from '../../common/entities'
import { WeightChange } from './weightChange.interface'

export interface WeightChangeSegment {
  account: ReportAccount
  organization: ReportOrganization
  change: WeightChange
  assignedProvider: ReportAccount
}
