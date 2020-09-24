/**
 * PATCH /measurement/body/:id
 */

export interface UpdateMeasurementBodyRequest {
  /** The measurement ID to update. */
  id: string;
  /** The date and time to update. */
  recordedAt?: string;
  /**
   * The parameter to update, where PARAM can be any of the optional inputs to Add user body measurements.
   * The value for the field can be either an integer to update the value, or null or an empty string to unset it.
   */
  PARAM?: any;
}
