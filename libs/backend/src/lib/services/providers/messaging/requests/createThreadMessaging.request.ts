/**
 * POST /message/thread
 */

export interface CreateThreadMessagingRequest {
  /** The subject of the thread. */
  subject: string;
  /** Id of organization to associate new thread. */
  organizationId?: string;
  /** The ID of user account who creates a thread. */
  creatorId: string;
  /** Array of accounts ids to associate with new thread. */
  accounts?: Array<string>;
}
