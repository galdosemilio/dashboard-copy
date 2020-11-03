import { Entity } from '../../common/entities'

export interface SequenceEnrollment {
  account: Entity
  createdAt: string
  id: string
  isActive: boolean
  sequence: any
}
