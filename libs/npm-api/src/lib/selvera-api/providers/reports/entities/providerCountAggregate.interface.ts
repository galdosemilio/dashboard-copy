/**
 *  Provider Count Aggregate for /warehouse/provider/count
 */

import { ReportOrganization } from '../../common/entities'

export interface ProviderCountAggregate {
  organization: ReportOrganization
  count: number
}
