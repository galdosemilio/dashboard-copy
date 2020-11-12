import { Entity } from '../../common/entities'
import { SequenceEntity } from '../entities'

export interface GetSequenceStateResponse {
  createdBy: Entity
  id: string
  name: string
  sequence: SequenceEntity
}
