/**
 * Interface for DELETE /mfa/preference/:id/section/:id
 */

export interface DeleteMFASectionRequest {
    /** ID of the preference that contains the section that's going to be deleted */
    preference: string;
    /** ID of the section instance that's going to be deleted */
    id: string;
}
