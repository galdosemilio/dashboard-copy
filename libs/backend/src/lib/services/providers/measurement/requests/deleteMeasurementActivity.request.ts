/**
 * DELETE /measurement/activity
 */

export interface DeleteMeasurementActivityRequest {
  /** The id of the client you are deleting the measurement for. Only required if requester is provider. */
  clientId: string;
  /** The day for this activity measurement, in YYYY-MM-DD format. */
  date: string;
}
