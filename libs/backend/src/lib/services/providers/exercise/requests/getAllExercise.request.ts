/**
 * GET /measurement/exercise
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllExerciseRequest {
  /** Client account id, required for Providers only. */
  account?: string;
  /** Start timestamp of activity span in ISO-8601 format. */
  start?: string;
  /** End timestamp of activity span in ISO-8601 format. */
  end?: string;
  /** Id of the exercise type. */
  exerciseType?: string;
  /** Page entry limit. Takes a number or can be set to 'all' to fetch all entries. */
  limit?: PageSize;
  /** The page offset. */
  offset?: PageOffset;
}
