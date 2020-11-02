/**
 * Interface for DELETE /mfa/:id
 */

export interface DeleteUserMFARequest {
    /** ID of the queried organization */
    organization: string;
    /** ID of the section instance that's going to be deleted */
    id: string;
}
