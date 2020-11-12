/**
 * Interface for Enrollment object
 */

import { EnrollmentDateRange, ReportPackage } from './'

export interface EnrollmentItem {
  /** Enrollment ID */
  id: string
  /** Package (phase) object */
  package: ReportPackage
  /** Created or last updated date */
  changedAt?: string
  /** Effective start & end dates of an enrollment */
  range?: EnrollmentDateRange
}
