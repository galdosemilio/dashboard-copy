/**
 * GET /measurement/exercise/type/:id
 */

export interface ExerciseTypeSingle {
  /** Exercise type ID. */
  id: string;
  /** Exercise type name. */
  name: string;
  /** Exercise type description. */
  description?: string;
  /** A flag indicating whether exercise type is active or not. */
  isActive: boolean;
}
