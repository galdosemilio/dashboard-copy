/**
 * GET /measurement/exercise/association
 */

export interface GetAllExerciseAssociationRequest {
  /** Organization id to filter associations. */
  organization: string;
  /** Exercise type ID to filter by. Cannot be given if title is given. */
  exerciseType?: string;
  /** Filter by title of exercise. Cannot be given if exerciseType is given. */
  title?: string;
  /** A flag that indicates whether to include inactive associations and exercises in the search. */
  includeInactive?: boolean;
}
