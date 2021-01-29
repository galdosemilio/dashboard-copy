import { NamedEntity } from '@coachcare/npm-api'

export interface MessageRecipient {
  id: string
  name: string
  firstName: string
  lastName: string
  accountType: string
}

export interface MessageThread {
  threadId?: string
  recipients: Array<MessageRecipient>
  lastMessageId?: string
  lastMessageDate?: string
  lastMessageSent?: string
  organization?: NamedEntity & { hierarchyPath: string[] }
  unread?: boolean
}
