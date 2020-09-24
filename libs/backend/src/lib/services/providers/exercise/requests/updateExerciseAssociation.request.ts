/**
 * PATCH /measurement/exercise/association/:id
 */

export interface UpdateExerciseAssociationRequest {
  /** Exercise type-organization ID. */
  id: string;
  /** A flag indicating whether association is active or not. */
  isActive: boolean;
  /** An SVG icon to use. Can be set to `null` if the icon should be removed. */
  icon?: string;
}
