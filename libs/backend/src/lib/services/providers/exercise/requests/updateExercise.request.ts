/**
 * PATCH /measurement/exercise/:id
 */

export interface UpdateExerciseRequest {
  /** Exercise entry ID. */
  id: string;
  /** Start timestamp of activity span in ISO-8601 format. Activity span will be updated only if both start & end are provided. */
  start?: string;
  /** End timestamp of activity span in ISO-8601 format. Activity span will be updated only if both start & end are provided. */
  end?: string;
  /** Id of the exercise type. */
  exerciseType?: string;
  /** Intensity - a number from 0 to 100. */
  intensity?: number;
  /** Exercise note. */
  note?: string;
}
