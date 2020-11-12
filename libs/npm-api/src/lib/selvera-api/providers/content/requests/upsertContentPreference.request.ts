/**
 * Interface for PUT /content/preference/:organization
 */

export interface UpsertContentPreferenceRequest {
  /** Organization ID */
  organization: string
  /** A flag indicating if the section should be enabled or disabled for an Organization */
  isActive: boolean
}
