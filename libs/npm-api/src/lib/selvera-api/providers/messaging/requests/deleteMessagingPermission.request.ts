/**
 * DELETE /message/permission/:threadId/:account
 */

export interface DeleteMessagingPermissionRequest {
    /** The id of the thread. */
    threadId: string;
    /** The account of the user. */
    account: string;
}
