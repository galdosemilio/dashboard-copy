/**
 * PATCH /measurement/exercise/type/:id
 */

export interface UpdateExerciseTypeRequest {
  id: number
  name?: string
  description?: string
  isActive?: string
}
