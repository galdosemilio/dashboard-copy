/**
 * Interface for PUT /package (request)
 */

export interface UpdatePackageRequest {
    id: string;
    title: string;
    shortcode: string;
    descriptionPublic: string;
    active: boolean;
}
