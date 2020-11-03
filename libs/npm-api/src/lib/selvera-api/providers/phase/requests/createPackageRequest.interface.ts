/**
 * Interface for POST /package (request)
 */

export interface CreatePackageRequest {
    title: string;
    shortcode: string;
    organization: string;
    descriptionPublic?: string;
    currency?: string;
}
