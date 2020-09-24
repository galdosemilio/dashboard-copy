/**
 * POST /meeting/type
 */

export interface CreateMeetingTypeRequest {
  /** Code of an type. */
  code: string;
  /** Description of an type. */
  description: string;
}
