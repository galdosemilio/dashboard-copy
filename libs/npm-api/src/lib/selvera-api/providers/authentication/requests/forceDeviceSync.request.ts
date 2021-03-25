export interface ForceDeviceSyncRequest {
  /** Account ID. Only required if called by an admin */
  account?: string
  /** Service name to sync device for */
  service: string
  /** Date range to sync device for */
  range: {
    /** Sync services from start date (inclusive) [YYYY-MM-DD] */
    start: string
    /** Sync services till end date (inclusive) [YYYY-MM-DD] */
    end: string
  }
}