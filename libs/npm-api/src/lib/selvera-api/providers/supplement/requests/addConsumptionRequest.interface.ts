/**
 * Interface for POST /supplement/consumption
 */

import { AddConsumptionSupplement } from './addConsumptionSupplement.interface';

export interface AddConsumptionRequest {
    account: string;
    date: string;
    supplements: Array<AddConsumptionSupplement>;
}
