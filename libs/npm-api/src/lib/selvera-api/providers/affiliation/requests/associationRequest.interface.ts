/**
 * Interface for POST /association
 */

import { AffiliationPermissions } from '../entities';

export interface AssociationRequest {
    account: string;
    organization: string;
    permissions?: Partial<AffiliationPermissions>;
}
