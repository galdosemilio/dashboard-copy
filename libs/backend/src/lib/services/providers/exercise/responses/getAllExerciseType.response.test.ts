/**
 * GET /measurement/exercise/type
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { exerciseTypeSingle } from '../../exercise/responses/exerciseType.single.test';
import { GetAllExerciseTypeResponse } from './getAllExerciseType.response';

export const getAllExerciseTypeResponse = createTest<GetAllExerciseTypeResponse>(
  'GetAllExerciseTypeResponse',
  {
    /** Data collection. */
    data: t.array(exerciseTypeSingle)
  }
);
