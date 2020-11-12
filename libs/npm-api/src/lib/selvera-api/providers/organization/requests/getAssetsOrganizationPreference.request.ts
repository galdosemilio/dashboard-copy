/**
 * GET /organization/:id/preference/assets
 */

export interface GetAssetsOrganizationPreferenceRequest {
  /** The id of the organization. */
  id: string
  /** Indicates whether to include MALA settings in the response. */
  mala?: boolean
}
