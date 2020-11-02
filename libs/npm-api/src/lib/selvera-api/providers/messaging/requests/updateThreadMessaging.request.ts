/**
 * PATCH /message/thread/:threadId/:account
 */

export interface UpdateThreadMessagingRequest {
    /** The ID of the thread. */
    threadId: string;
    /** The ID of the account. */
    account: string;
    /** A flag indicating whether the thread should be marked as active or not for the user. */
    isActive: boolean;
}
