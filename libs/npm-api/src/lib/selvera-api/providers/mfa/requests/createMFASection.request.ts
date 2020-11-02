import { AccountTypeIds } from '../../account/entities';

/**
 * Interface for POST /mfa/preference/:id/section
 */

export interface CreateMFASectionRequest {
    /** ID of the involved preference */
    preference: string;
    /** Account type ID that is affected by this section */
    accountType: AccountTypeIds;
    /** ID of the app section that will be affected by this instance */
    section: string;
    /** If MFA is required for this section/accountType pair */
    isRequired: boolean;
}
