/**
 * GET /measurement/exercise/type
 */

import { ExerciseType } from '../entities';

export interface GetAllExerciseTypeResponse {
    data: Array<ExerciseType>;
}
