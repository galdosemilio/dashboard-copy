/**
 * Interface for GET /warehouse/enrollment/accounts-by-organization (response)
 */

import { ReportOrganization } from '../../common/entities'
import { ReportPackage } from '../entities'

export interface EnrollmentSnapshotSegment {
  organization: ReportOrganization
  package: ReportPackage
  count: number
}
