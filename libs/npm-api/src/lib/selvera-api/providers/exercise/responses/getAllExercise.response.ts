/**
 * GET /measurement/exercise
 */

import { PaginationResponse } from '../../common/entities'
import { ExerciseType } from '../entities'

export interface GetAllExerciseResponse {
  data: Array<{
    id: string
    account: string
    activitySpan: {
      start: string
      end: string
    }
    exerciseType: ExerciseType
    createdAt: string
    intensity: number
    note?: string
  }>
  pagination: PaginationResponse
}
