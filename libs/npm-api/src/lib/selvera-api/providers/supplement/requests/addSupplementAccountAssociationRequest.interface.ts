/**
 * Interface for POST /supplement/account/organization/
 */

export interface AddSupplementAccountAssociationRequest {
    supplementOrganization: string;
    account: string;
    dosage?: number;
}
