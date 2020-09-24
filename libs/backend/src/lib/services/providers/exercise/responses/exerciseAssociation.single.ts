/**
 * GET /measurement/exercise/association/:id
 */

export interface ExerciseAssociationSingle {
  /** Exercise type-organization id. */
  id: string;
  /** The associated organization. */
  organization: string;
  /** The associated exercise type. */
  exerciseType: string;
  /** A flag indicating whether the association is active or not. */
  isActive: boolean;
  /** An SVG icon. */
  icon?: string;
}
