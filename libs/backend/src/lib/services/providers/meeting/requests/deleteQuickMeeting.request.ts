/**
 * DELETE /meeting/quick/:token
 */

export interface DeleteQuickMeetingRequest {
  /** The token to validate delete. */
  token: string;
}
