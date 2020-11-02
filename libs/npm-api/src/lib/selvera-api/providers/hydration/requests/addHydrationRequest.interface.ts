/**
 * Interface for POST /hydration/
 */

import { HydrationUnitRequest } from './hydrationUnitRequest.type';

export interface AddHydrationRequest {
    account?: string;
    date: string;
    quantity: number;
    unit: HydrationUnitRequest;
}
