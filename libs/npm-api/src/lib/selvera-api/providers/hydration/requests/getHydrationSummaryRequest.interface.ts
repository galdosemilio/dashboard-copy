/**
 * Interface for GET /hydration/summary
 */

import { DateUnitRequest } from './dateUnitRequest.type';

export interface GetHydrationSummaryRequest {
    account?: string;
    startDate: string;
    endDate?: string;
    unit: DateUnitRequest;
}
