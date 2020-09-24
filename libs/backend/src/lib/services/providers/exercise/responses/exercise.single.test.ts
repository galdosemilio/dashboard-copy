/**
 * GET /measurement/exercise/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { ExerciseSingle } from './exercise.single';

export const exerciseSingle = createValidator({
  /** ID of the exercise entry. */
  id: t.string,
  /** Account ID of the exercise entry. */
  account: t.string,
  /** Activity time span of the exercise. */
  activitySpan: createValidator({
    /** Start of activity time span. */
    start: t.string,
    /** End of activity time span. */
    end: t.string
  }),
  /** Exercise type object. */
  exerciseType: createValidator({
    /** Exercise type ID. */
    id: t.string,
    /** Exercise type name. */
    name: t.string,
    /** Exercise type description. */
    description: t.string,
    /** A flag indicating whether exercise type is active or not. */
    isActive: t.boolean
  }),
  /** Exercise-account creation timestamp. */
  createdAt: t.string,
  /** Exercise intensity. */
  intensity: t.number,
  /** Exercise note. */
  note: optional(t.string)
});

export const exerciseResponse = createTestFromValidator<ExerciseSingle>(
  'ExerciseSingle',
  exerciseSingle
);
