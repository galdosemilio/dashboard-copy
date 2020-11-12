/**
 * Interface for POST /sequence/preference/organization
 */

export interface CreateSeqOrgPreferenceRequest {
  /** A flag indicating if the entry is active */
  isActive?: boolean
  /** Organization ID */
  organization: string
}
