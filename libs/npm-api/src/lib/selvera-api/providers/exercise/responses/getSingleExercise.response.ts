/**
 * GET /measurement/exercise/:id
 */

export interface GetSingleExerciseResponse {
    id: string;
    account: string;
    activitySpan: {
        start: string;
        end: string;
    };
    exerciseType: {
        id: string;
        name: string;
        description: string;
        isActive: boolean;
    };
    createdAt: string;
    intensity: number;
    note?: string;
}
