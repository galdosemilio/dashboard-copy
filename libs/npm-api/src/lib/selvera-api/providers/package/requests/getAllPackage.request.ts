/**
 * GET /package
 */

import { PageOffset, PageSize } from '../../content/entities'

export interface GetAllPackageRequest {
  /** Restrict results to only active or inactive entries. */
  isActive?: boolean
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset
}
