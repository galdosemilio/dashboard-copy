/**
 * GET /measurement/exercise/association/:id
 */

export interface GetSingleExerciseAssociationResponse {
    id: string;
    organization: string;
    exerciseType: string;
    isActive: boolean;
    icon: string;
}
