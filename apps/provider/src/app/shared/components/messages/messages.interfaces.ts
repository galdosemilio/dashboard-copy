import { NamedEntity } from '@coachcare/sdk'

export interface MessageRecipient {
  id: string
  name: string
  shortName: string
  firstName: string
  lastName: string
  accountType: string
}

export interface MessageThread {
  threadId?: string
  allRecipients: Array<MessageRecipient>
  recipients: Array<MessageRecipient>
  lastMessageId?: string
  lastMessageDate?: string
  lastMessageSent?: string
  organization?: NamedEntity & { hierarchyPath: string[] }
  unread?: boolean
}
