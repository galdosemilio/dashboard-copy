/**
 * GET /meeting/type/organization/:organization
 */

export interface GetAllMeetingTypeOrganizationResponse {
  /** An array of meeting-types objects. */
  meetingTypes: Array<{
    /** The id of this meeting-type. */
    typeId: number;
    /** The code of this meeting-type. */
    code: string;
    /** The description of this meeting-type. */
    description: string;
    /** The status of this meeting-type. */
    isActive: boolean;
    /** The collection of durations (Postgres intervals) for a meeting type for this organization. */
    durations: Array<string>;
  }>;
}
