/**
 * Interface for GET /supplement
 */

export interface SearchSupplementsRequest {
    query: string;
    includeInactive?: boolean;
}
