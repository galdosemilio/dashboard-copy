/**
 * PATCH /measurement/exercise
 */

export interface UpdateExerciseRequest {
    id: string;
    account: string;
    start: string;
    end: string;
    exerciseType: string;
    intensity: number;
    note?: string;
}
