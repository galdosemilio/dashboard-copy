export interface TriggerLocalization {
  /** TriggerLocalization creation timestamp */
  createdAt: string
  /** Locale identifier */
  locale: string
  /** Last update timestamp for the TriggerLocalization */
  updatedAt?: string
  /** Locale-specific Trigger payload. Structure depends on the type */
  payload: any
}
