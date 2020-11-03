/**
 * POST /package
 */

export interface CreatePackageRequest {
    /** The unique title of this package or product. */
    title: string;
    /** The public description of this package. */
    description?: string;
    /** The payload object for the package. */
    payload?: any;
}
