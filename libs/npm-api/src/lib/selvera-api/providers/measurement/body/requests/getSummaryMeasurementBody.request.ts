/**
 * GET /measurement/body/summary
 */

export interface GetSummaryMeasurementBodyRequest {
    /** Account for which the summary should be retrieved. Automatically filled in for clients. */
    account?: string;
    /** Start date. */
    start?: string;
    /** End date. */
    end?: string;
}
