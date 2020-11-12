/**
 * LastMessage
 */

export interface LastMessage {
  /** The id of the last message sent. */
  id: string
  /** The timestamp of the last message sent. */
  date: string
  /** The content of the last message sent. */
  content: string
  /** Last message account ID */
  accountId: string
}
