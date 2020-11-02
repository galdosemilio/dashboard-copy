/**
 * GET /measurement/exercise/type
 */

export interface GetAllExerciseTypeRequest {
    query?: string;
    includeInactive?: boolean;
    limit?: any;
    offset?: number;
}
