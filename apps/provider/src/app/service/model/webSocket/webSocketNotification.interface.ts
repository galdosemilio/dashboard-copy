import { Entity } from '@coachcare/sdk'

export interface WebSocketNotification {
  organization: Entity
  recipient: Entity
  sentAt: string
  type: string
}
