/**
 * GET /measurement/exercise/type/:id
 */

export interface GetSingleExerciseTypeResponse {
  id: string
  name: string
  description?: string
  isActive: boolean
}
