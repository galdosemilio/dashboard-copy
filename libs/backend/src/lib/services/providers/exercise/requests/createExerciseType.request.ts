/**
 * POST /measurement/exercise/type
 */

export interface CreateExerciseTypeRequest {
  /** Exercise type name. */
  name: string;
  /** Exercise type description. */
  description?: string;
}
