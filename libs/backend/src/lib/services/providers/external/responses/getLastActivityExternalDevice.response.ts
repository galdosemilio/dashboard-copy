/**
 * GET /measurement/device/sync
 */

export interface GetLastActivityExternalDeviceResponse {
  /** Array of measurement devices objects. */
  data: Array<{
    /** The device id. */
    id: string;
    /** The title. */
    title: string;
    /** The service name from database. */
    service: string;
    /** The device description. */
    description: string;
    /**
     * Indicates when the service was last authenticated to.
     * Only available for devices that have third party integration set up at the given moment.
     */
    lastAuthenticatedAt?: string;
    /** Indicates when the last sync took place. Only available for third party data providers that are periodically synced. */
    lastSyncedAt?: string;
  }>;
}
