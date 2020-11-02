/**
 * GET /package/enrollment/:id
 */

import { Entity } from '../../common/entities'
import { EnrollmentDates, PackageRef } from '../entities'

export interface PackageEnrollmentSingle {
  /** The account associated with this enrollment. */
  account: Entity
  /** The package associated with this enrollment. */
  package: PackageRef
  /** The organization associated with this package, which is associated with this enrollment. */
  organization: Entity
  /** If this enrollment is active. */
  isActive: boolean
  /** Enrollment dates. */
  enroll: EnrollmentDates
}
