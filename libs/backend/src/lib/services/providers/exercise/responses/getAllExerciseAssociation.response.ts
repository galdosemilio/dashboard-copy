/**
 * GET /measurement/exercise/association
 */

import { Entity } from '../../../shared';
import { ExerciseTypeSingle } from '../../exercise/responses/exerciseType.single';

export interface GetAllExerciseAssociationResponse {
  /** Exercise type-organization id. */
  id: string;
  /** A flag indicating whether the association is active or not. */
  isActive: boolean;
  /** Associated organization. */
  organization: Entity;
  /** Associated exercise type. */
  type: ExerciseTypeSingle;
  /** An SVG icon. */
  icon?: string;
}
