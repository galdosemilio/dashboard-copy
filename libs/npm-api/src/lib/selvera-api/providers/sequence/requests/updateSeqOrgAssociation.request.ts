/**
 * Interface for PATCH /sequence/organization/:id
 */

export interface UpdateSeqOrgAssociationRequest {
    /** ID of the user that created the Sequence */
    createdBy: string;
    /** Association ID */
    id: string;
    /** A flag indicating if the Association is active or not */
    isActive?: boolean;
    /** Sequence ID */
    sequence: string;
}
