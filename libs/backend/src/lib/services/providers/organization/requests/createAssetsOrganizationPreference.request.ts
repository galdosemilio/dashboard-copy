/**
 * POST /organization/:id/preference/asset
 */

export interface CreateAssetsOrganizationPreferenceRequest {
  /** The id of the organization. */
  id: string;
  /** Asset collection. */
  assets: Array<{
    /** Asset name. Has to be unique in the collection. */
    name: string;
  }>;
}
