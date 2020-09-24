/**
 * PUT /meeting/type/organization
 */

export interface UpdateMeetingTypeOrganizationRequest {
  /** Type ID. */
  typeId: string;
  /** Organization ID. */
  organization: string;
  /** Postgres interval collection. */
  durations: Array<string>;
}
