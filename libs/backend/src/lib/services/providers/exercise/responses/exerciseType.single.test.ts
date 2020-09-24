/**
 * GET /measurement/exercise/type/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ExerciseTypeSingle } from './exerciseType.single';

export const exerciseTypeSingle = createValidator({
  /** Exercise type ID. */
  id: t.string,
  /** Exercise type name. */
  name: t.string,
  /** Exercise type description. */
  description: optional(t.string),
  /** A flag indicating whether exercise type is active or not. */
  isActive: t.boolean
});

export const exerciseTypeResponse = createTestFromValidator<ExerciseTypeSingle>(
  'ExerciseTypeSingle',
  exerciseTypeSingle
);
