/**
 * GET /measurement/exercise
 */

export interface GetAllExerciseRequest {
    account?: string;
    start?: string;
    end?: string;
    exerciseType?: string;
    limit?: number | 'all';
    offset?: number;
}
