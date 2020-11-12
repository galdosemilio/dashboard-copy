/**
 * PackageEnrollmentSegment
 */

import { Entity } from '../../common/entities'
import { EnrollmentDates } from './enrollmentDates'
import { PackageRef } from './packageRef'

export interface PackageEnrollmentSegment {
  /** The id of this enrollment. */
  id: string
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
