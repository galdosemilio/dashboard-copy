interface SortingOption {
    property: 'name' | 'changedAt';
    dir: 'asc' | 'desc';
}

/**
 * Interface for GET /warehouse/patient-listing/association
 */

export interface FetchPatientListingAssociationRequest {
    account: string;
    limit?: number | 'all';
    offset?: number;
    organization: string;
    sort?: SortingOption[];
}
