/**
 * GET /key/organization
 */

export interface GetAllKeyOrganizationRequest {
  /** Account id to filter keys. Optional, if requester is a Client, otherwise required. */
  account: string;
  /** Organization id. */
  organization: string;
  /** ID of the key-organization association. */
  keyOrganizationId?: string;
  /** Key name. */
  name?: string;
  /** Flag that indicates whether to include active/inactive key organization associations. */
  isActive?: string;
  /**
   * Flag that indicates whether we should return only key-organization associations that have direct account association defined too.
   * Works together with 'account' parameter.
   */
  directAssociation?: string;
}
