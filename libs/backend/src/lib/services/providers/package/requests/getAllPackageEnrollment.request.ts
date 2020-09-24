/**
 * GET /package/enrollment
 */

import { EnrollmentSort, PageOffset, PageSize } from '../../../shared';

export interface GetAllPackageEnrollmentRequest {
  /**
   * If requester is a client, this value will always be ovewritten with their own user id.
   * If requester is provider, this field is required, and they must have access to the passed client id.
   */
  account: string;
  /** Organization to fetch enrollments for. */
  organization: string;
  /** Return enrollments only for this package. */
  package?: string;
  /** Return enrollments only that are active or inactive (true|false) */
  isActive?: boolean;
  /** A collection that determines how the result should be sorted. */
  sort?: Array<EnrollmentSort>;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
