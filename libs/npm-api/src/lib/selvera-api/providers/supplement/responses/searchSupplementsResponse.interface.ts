/**
 * Interface for GET /supplement (Response)
 */

import { SupplementResponse } from './supplementResponse.interface';

export interface SearchSupplementsResponse {
    supplements: Array<SupplementResponse>;
}
