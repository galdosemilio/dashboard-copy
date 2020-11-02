/**
 * Interface for GET /package (response)
 */

import { FetchPackagesSegment } from './fetchPackagesSegment.interface';

export interface FetchPackagesResponse {
    data: Array<FetchPackagesSegment>;
    pagination: {
        next?: number;
        prev?: number;
    };
}
