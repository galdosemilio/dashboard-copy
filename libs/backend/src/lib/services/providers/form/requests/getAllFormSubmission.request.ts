/**
 * GET /content/form/submission
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllFormSubmissionRequest {
  /** Form ID to filter by. */
  form?: string;
  /** Organization ID. */
  organization: string;
  /** Account ID. */
  account?: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
