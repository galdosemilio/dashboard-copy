interface SortingOption {
    property: 'firstName' | 'lastName' | 'email' | 'startedAt';
    dir: 'asc' | 'desc';
}

interface PackageSort {
    property: 'name' | 'startedAt';
    dir: 'asc' | 'desc';
}

/**
 * Interface for GET /warehouse/patient-listing
 */

export interface FetchPatientListingRequest {
    limit?: number | 'all';
    offset?: number;
    organization: string;
    pkg?: string[];
    ['pkg-filter']?: 'all' | 'any';
    ['pkg-sort']?: PackageSort[];
    sort?: SortingOption[];
}
