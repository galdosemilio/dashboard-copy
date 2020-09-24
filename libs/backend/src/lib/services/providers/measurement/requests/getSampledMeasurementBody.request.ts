/**
 * GET /measurement/body/sampled
 */

export interface GetSampledMeasurementBodyRequest {
  /** Account for which the sampled measurements should be retrieved. Automatically filled in for clients. */
  account?: string;
  /** The requested sample count. */
  count?: number;
  /** Data point to retrieve. */
  data?: string;
}
