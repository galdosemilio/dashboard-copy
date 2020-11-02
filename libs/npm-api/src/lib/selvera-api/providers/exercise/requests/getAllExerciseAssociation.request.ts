/**
 * GET /measurement/exercise/association
 */

export interface GetAllExerciseAssociationRequest {
    organization: string;
    exerciseType?: string;
    title?: string;
    includeInactive?: boolean;
}
