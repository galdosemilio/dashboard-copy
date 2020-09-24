/**
 * GET /content/form/addendum
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllFormAddendumRequest {
  /** ID of the submission that addendums should be taken for. */
  submission: string;
  /** Page size. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of items to offset from beginning of the result set. */
  offset?: PageOffset;
}
