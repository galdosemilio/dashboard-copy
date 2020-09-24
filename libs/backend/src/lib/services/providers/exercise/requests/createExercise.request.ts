/**
 * POST /measurement/exercise
 */

export interface CreateExerciseRequest {
  /** Client account id. Optional for Client requests, otherwise required. */
  account?: string;
  /** Start timestamp of activity span in ISO-8601 format. */
  start: string;
  /** End timestamp of activity span in ISO-8601 format. */
  end: string;
  /** Id of the exercise type. */
  exerciseType: string;
  /** Intensity - a number from 0 to 100. */
  intensity: number;
  /** Exercise note. */
  note?: string;
}
