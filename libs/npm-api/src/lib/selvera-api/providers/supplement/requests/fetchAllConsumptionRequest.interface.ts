/**
 * Interface for GET /supplement/consumption
 */

export interface FetchAllConsumptionRequest {
    account: string;
    offset?: number;
    startDate?: string;
    endDate?: string;
}
