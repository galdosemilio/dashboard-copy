/**
 * GET /organization/:id/preference
 */

export interface GetSingleOrganizationPreferenceRequest {
  /** The id of the organization. */
  id: string
  /** Indicates whether to include MALA settings in the response. */
  mala?: boolean
}
