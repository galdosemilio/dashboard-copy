/**
 * packageEnrollmentSegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../generic/index.test';
import { enrollmentDates } from './enrollmentDates.test';
import { packageRef } from './packageRef.test';

export const packageEnrollmentSegment = createValidator({
  /** The id of this enrollment. */
  id: t.string,
  /** The account associated with this enrollment. */
  account: entity,
  /** The package associated with this enrollment. */
  package: packageRef,
  /** The organization associated with this package, which is associated with this enrollment. */
  organization: entity,
  /** If this enrollment is active. */
  isActive: t.boolean,
  /** Enrollment dates. */
  enroll: enrollmentDates
});
