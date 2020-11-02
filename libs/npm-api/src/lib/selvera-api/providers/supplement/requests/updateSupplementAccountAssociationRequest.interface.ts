/**
 * Interface for PUT /supplement/account/organization/:id
 */

export interface UpdateSupplementAccountAssociationRequest {
    id: string;
    dosage?: number;
}
