/**
 * GET /measurement/exercise/association
 */

import { Entity } from '../../common/entities'
import { ExerciseType } from '../entities'

export interface GetAllExerciseAssociationResponse {
  data: Array<{
    id: string
    isActive: boolean
    organization: Entity
    type: ExerciseType
    icon: string
  }>
}
