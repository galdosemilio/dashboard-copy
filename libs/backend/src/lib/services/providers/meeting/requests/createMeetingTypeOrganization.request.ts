/**
 * POST /meeting/type/organization
 */

export interface CreateMeetingTypeOrganizationRequest {
  /** Type ID. */
  typeId: string;
  /** Organization ID. */
  organization: string;
  /** Postgres interval collection. */
  durations: Array<string>;
}
