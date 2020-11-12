/**
 * GET /content/form/submission
 */

import { PageOffset, PageSize } from '../../content/entities'

export interface GetAllFormSubmissionRequest {
  /** Return the answers array along with each record */
  answers?: boolean
  /** Submission creation timestamp range filter */
  createdAt?: {
    /** Indicates that only entries created after or at the timestamp should be included */
    after?: string
    /** Indicates that only entries created before or at the timestamp should be included */
    before?: string
  }
  /** Form ID to filter by. */
  form?: string
  /** Organization ID. */
  organization: string
  /** Account ID. */
  account?: string
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset
}
