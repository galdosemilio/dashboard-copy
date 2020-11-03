/**
 * Interface for GET /hydration
 */

import { DateOrderRequest } from './dateOrderRequest.type';

export interface GetHydrationRequest {
    offset?: string;
    account?: string;
    startDate?: string;
    endDate?: string;
    order?: DateOrderRequest;
}
