/**
 * GET /goal
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GoalSingle } from './goal.single';

export const goalSingle = createValidator({
  /** A collection of goals. */
  goals: t.array(
    createValidator({
      /** The account-goal association ID. */
      id: t.string,
      /** The quantity associated with the goal. */
      quantity: t.number,
      /** Type of the associated goal. */
      type: createValidator({
        /** ID of the goal type. */
        id: t.string,
        /** Name of the goal type. */
        name: t.string,
        /** Code of the goal type. */
        code: t.string
      })
    })
  )
});

export const goalResponse = createTestFromValidator<GoalSingle>('GoalSingle', goalSingle);
