import { AssociationOptions } from '../entities';

/**
 * Interface for POST /sequence
 */

export interface CreateSequenceRequest {
    /** Organization association options */
    association?: AssociationOptions;
    /** The ID of the user creating the Sequence */
    createdBy: string;
    /** A flag indicating if the sequence is active */
    isActive?: boolean;
    /** Name of the sequence */
    name: string;
    /** Organization ID */
    organization: string;
}
