/**
 * Interface for GET /package/:id (response)
 */

export interface FetchPackageResponse {
    id: string;
    shortcode: string;
    title: string;
    description: string;
    organization: {
        id: string;
        name: string;
    };
    createdAt: string;
    isActive: boolean;
}
