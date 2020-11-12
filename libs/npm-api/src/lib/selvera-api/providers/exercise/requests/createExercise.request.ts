/**
 * POST /measurement/exercise
 */

export interface CreateExerciseRequest {
  account: string
  start: string
  end: string
  exerciseType: string
  intensity: number
  note?: string
}
