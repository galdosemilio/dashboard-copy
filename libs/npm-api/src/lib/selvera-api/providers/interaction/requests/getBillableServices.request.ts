/**
 * Interface for GET /communication/interaction/billable-service
 */

export interface GetBillableServicesRequest {
    offset?: number;
    limit?: number | 'all';
    status?: 'active' | 'inactive' | 'all';
}
