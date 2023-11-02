import { NamedEntity } from '@coachcare/sdk'
import { MessageRecipient } from './message-recipient.interface'

export interface MessageThread {
  threadId?: string
  allRecipients: Array<MessageRecipient>
  recipients: Array<MessageRecipient>
  hasParticipants: boolean
  lastMessageId?: string
  lastMessageDate?: string
  lastMessageSent?: string
  organization?: NamedEntity & { hierarchyPath: string[] }
  unread?: boolean
}
