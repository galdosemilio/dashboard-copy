/**
 * DELETE /meeting/type/:typeId/organization/:organization
 */

export interface DeleteMeetingTypeOrganizationRequest {
  /** Type ID. */
  typeId: string;
  /** Organization ID. */
  organization: string;
}
