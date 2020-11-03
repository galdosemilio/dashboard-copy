/**
 * Interface for PUT /hydration
 */

import { HydrationUnitRequest } from './hydrationUnitRequest.type';

export interface UpdateHydrationRequest {
    account?: string;
    unit: HydrationUnitRequest;
    date: string;
    quantity: number;
}
