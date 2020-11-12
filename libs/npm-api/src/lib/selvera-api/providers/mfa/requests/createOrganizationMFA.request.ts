/**
 * Interface for POST /mfa/preference
 */

export interface CreateOrganizationMFARequest {
  /** Organization associated with the new instance */
  organization: string
  /** If MFA is set up or not */
  isActive: boolean
}
