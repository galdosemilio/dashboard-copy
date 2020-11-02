/**
 * Interface for Organization Activity Aggregate
 */

import { ReportOrganization } from '../../common/entities'
import { ReportClients, ReportProviders } from '../entities'

export interface OrganizationActivityAggregate {
  organization: ReportOrganization
  clients: ReportClients
  providers: ReportProviders
  date: string
}
