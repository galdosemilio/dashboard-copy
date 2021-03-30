/**
 * Interface for PATCH /rpm/preference/organization/:id
 */

export interface UpdateRPMPreferenceRequest {
  /** RPM preference ID */
  id: string
  /** A flag that determines if the RPM notifications are active for this Organization */
  isActive?: boolean
  isSubscriptionTarget?: boolean
  taxIdentificationNumber?: string | null
}
