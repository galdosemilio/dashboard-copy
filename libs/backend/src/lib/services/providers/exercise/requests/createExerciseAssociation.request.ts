/**
 * POST /measurement/exercise/association
 */

export interface CreateExerciseAssociationRequest {
  /** Exercise type ID. */
  exerciseType: string;
  /** Organization ID. */
  organization: string;
  /** An SVG icon to use. */
  icon?: string;
}
