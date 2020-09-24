/**
 * GET /meeting/type
 */

export interface GetAllMeetingTypeResponse {
  /** Collection of meeting types. */
  types: Array<{
    /** Meeting type ID. */
    id: number;
    /** Meeting type code. */
    code?: string;
    /** Meeting type description. */
    description: string;
    /**
     * A flag indicating if a meeting type is currently active.
     * Only included in the response if 'includeInactive' flag is set to 'true'.
     */
    isActive?: boolean;
  }>;
}
