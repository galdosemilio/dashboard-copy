/**
 * GET /measurement/exercise/type
 */

import { ListResponse } from '../../../shared';
import { ExerciseTypeSingle } from '../../exercise/responses/exerciseType.single';

export type GetAllExerciseTypeResponse = ListResponse<ExerciseTypeSingle>;
