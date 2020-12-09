import { NamedEntity } from '../../common/entities'
import { InteractionParticipant } from './interactionParticipant'

export interface InteractionAuditEntry {
  createdBy: {
    id: string
    firstName: string
    lastName: string
  }
  note: string
  billableService: {
    previous?: NamedEntity
    current?: NamedEntity
  }
}

export interface InteractionSingle {
  auditLog?: InteractionAuditEntry[]
  billableService: NamedEntity
  id: string
  initiator: InteractionParticipant
  organization: {
    id: string
    name: string
    hierarchyPath: string[]
  }
  participants: {
    attended: InteractionParticipant[]
    requested: InteractionParticipant[]
  }
  room?: string
  source: NamedEntity
  status: string
  subaccount?: {
    id: string
  }
  time: {
    end: string
    start: string
  }
  type?: NamedEntity
}
