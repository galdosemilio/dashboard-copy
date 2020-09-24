/**
 * GET /measurement/exercise/type
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllExerciseTypeRequest {
  /** A query to filter the exercise type name/description by. */
  query?: string;
  /** A flag indicating whether to include inactive entries. */
  includeInactive?: boolean;
  /** Page size limit. Can be set to 'all' or a number. */
  limit?: PageSize;
  /** Paging offset. */
  offset?: PageOffset;
}
