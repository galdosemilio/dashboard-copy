/**
 * GET /conference/video/call
 */

export interface GetAllConferenceCallRequest {
  /** ID of the account to look up the call for. */
  account: string;
  /** Organization ID. */
  organization?: string;
  /** If 'true' - return only calls that currently in progress. If 'false' - return ended calls. */
  inProgress?: boolean;
}
