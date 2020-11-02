import { Entity } from '../../common/entities'

export interface MessagingPreferenceSingle {
  id: string
  isActive: boolean
  organization: Entity
}
