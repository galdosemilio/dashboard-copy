/**
 * Interface for POST /rpm/preference/organization
 */

export interface CreateRPMPreferenceRequest {
  /** A flag that determines if the RPM notifications are active or not */
  isActive: boolean
  isSubscriptionTarget?: boolean
  /** The ID of the Organization */
  organization: string
  taxIdentificationNumber?: string
}
