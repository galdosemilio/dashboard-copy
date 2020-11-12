/**
 * POST /measurement/exercise/association
 */

export interface CreateExerciseAssociationRequest {
  exerciseType: string
  organization: string
  icon: string
}
