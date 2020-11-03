/**
 * Interface for PATCH /account/:account/activity
 */

export interface AccActivityRequest {
    account: string;
    isActive: boolean;
}
