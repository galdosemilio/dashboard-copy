/**
 * PATCH /measurement/exercise/type/:id
 */

export interface UpdateExerciseTypeRequest {
  /** Exercise type ID. */
  id: string;
  /** Exercise type name. */
  name?: string;
  /** Exercise type description. Can be set to `null` to clear the value. */
  description?: string;
  /** A flag indicating whether exercise type is active or not. */
  isActive?: string;
}
