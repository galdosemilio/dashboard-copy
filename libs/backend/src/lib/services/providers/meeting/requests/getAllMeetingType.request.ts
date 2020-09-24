/**
 * GET /meeting/type
 */

export interface GetAllMeetingTypeRequest {
  /** ID of an organization to resolve hierarchy to get the matching types for. */
  organization?: string;
  /** A flag indicating whether to include inactive meeting types. */
  includeInactive?: boolean;
}
