/**
 * MessagingThreadSegment
 */

import { NamedEntity } from '../../common/entities'
import { LastMessage } from './lastMessage'
import { MessagingAccount } from './messagingAccount'

export interface MessagingThreadSegment {
  /** The id of the thread. */
  threadId: string
  /** The subject of the thread. */
  subject: string
  /** The array of accounts associated with this record. */
  account: Array<MessagingAccount>
  /** Last message sent. */
  lastMessage: LastMessage
  /** Boolean value whether or not the user has read the thread (last message) */
  viewed: boolean
  /** Organization basic data */
  organization: NamedEntity & { hierarchyPath: string[] }
}
