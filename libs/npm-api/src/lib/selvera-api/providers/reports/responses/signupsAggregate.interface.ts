/**
 * Interface for EnrollmentAggregate
 */

import { ReportOrganization } from '../../common/entities'

export interface SignupsAggregate {
  organization: ReportOrganization
  signUps: number
}
