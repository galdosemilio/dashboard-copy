/**
 * Interface for GET /package/enrollment (response)
 */

import { FetchEnrollmentResponse } from './fetchEnrollmentResponse.interface';

export interface FetchEnrollmentsResponse {
    data: Array<FetchEnrollmentResponse>;
    pagination: {
        next?: number;
        prev?: number;
    };
}
