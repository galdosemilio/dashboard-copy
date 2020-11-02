/**
 * Interface for GET /supplement/organization/:id (Response)
 */

import { SupplementResponse } from './supplementResponse.interface';

export interface FetchSupplementAssociationResponse {
    id: string;
    organizationId: string;
    supplement: SupplementResponse;
    dosage?: number;
}
