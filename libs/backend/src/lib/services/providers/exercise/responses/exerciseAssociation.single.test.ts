/**
 * GET /measurement/exercise/association/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ExerciseAssociationSingle } from './exerciseAssociation.single';

export const exerciseAssociationSingle = createValidator({
  /** Exercise type-organization id. */
  id: t.string,
  /** The associated organization. */
  organization: t.string,
  /** The associated exercise type. */
  exerciseType: t.string,
  /** A flag indicating whether the association is active or not. */
  isActive: t.boolean,
  /** An SVG icon. */
  icon: optional(t.string)
});

export const exerciseAssociationResponse = createTestFromValidator<ExerciseAssociationSingle>(
  'ExerciseAssociationSingle',
  exerciseAssociationSingle
);
