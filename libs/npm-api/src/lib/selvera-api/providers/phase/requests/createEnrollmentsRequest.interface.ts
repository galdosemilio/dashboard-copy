/**
 * Interface for POST /package/enrollment (request)
 */

export interface CreateEnrollmentsRequest {
    account: number | string; // iIf requester is client, this value will be populated automatically
    package?: number | string; // must be passed if shortcode is not
    shortcode?: string; // must be passed if package is not
}
