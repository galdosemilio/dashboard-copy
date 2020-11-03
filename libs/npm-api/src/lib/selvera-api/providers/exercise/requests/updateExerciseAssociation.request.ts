/**
 * PATCH /measurement/exercise/association/:id
 */

export interface UpdateExerciseAssociationRequest {
    id: number;
    isActive: boolean;
    icon: string;
}
