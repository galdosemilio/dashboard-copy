/**
 * PUT /measurement/device/sync/healthkit
 */

export interface SyncHealthKitExternalDeviceRequest {
  /** Timestamp of last sync in ISO-8601 format. Defaulted to the current timestamp. */
  syncDate?: string;
}
