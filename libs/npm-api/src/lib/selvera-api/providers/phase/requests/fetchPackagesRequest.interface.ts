/**
 * Interface for GET /package
 */

export interface FetchPackagesRequest {
    organization?: string;
    shortcode?: string;
    offset?: number;
    active?: boolean;
}
