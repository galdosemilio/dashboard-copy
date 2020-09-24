/**
 * POST /message
 */

export interface AddMessageMessagingRequest {
  /** The id of the thread to add the message to. If empty then thread subject is required. */
  threadId?: string;
  /** The subject of new thread. Ignored if threadId is passed. */
  subject?: string;
  /** Id of organization to associate new thread. */
  organization?: string;
  /** The content of the message. */
  content: string;
  /** Array of accounts ids to associate with new thread. */
  accounts?: Array<string>;
}
