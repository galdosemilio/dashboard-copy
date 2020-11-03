/**
 * Interface for GET /conference/subaccount (response)
 */

export interface FetchAllSubaccountsResponse {
    data: Subaccount;
}

export interface Subaccount {
    id: string;
    createdAt: string;
    updatedAt?: string;
    isActive: boolean;
    hasKeys: boolean;
}
