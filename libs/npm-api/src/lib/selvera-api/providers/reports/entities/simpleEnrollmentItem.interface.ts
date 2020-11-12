/**
 * Collection of report items
 */
import { EnrollmentAccount, EnrollmentItem, ExternalIdentifier } from '.'
import { ReportOrganization } from '../../common/entities'

export interface SimpleEnrollmentItem {
  /** Account object */
  account: EnrollmentAccount
  /** Organization object */
  organization: ReportOrganization
  /** Enrollment object */
  enrollment?: EnrollmentItem
  /** External identifier object */
  externalIdentifier?: ExternalIdentifier
  /** A flag indicating if the account was enrolled in any of the packages passed as `enrolledPackageIds` in selected period. */
  wasInAnyOfSelectedPhases: boolean
}
