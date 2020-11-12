/**
 * Interface for GET /mfa/preference
 */

export interface GetMFAOrganizationPreferenceRequest {
  /** ID of the queried organization */
  organization: string
  /** Status of the preference */
  status: 'all' | 'active' | 'inactive'
}
