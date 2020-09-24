/**
 * POST /conference/subaccount/
 */

export interface CreateConferenceSubaccountRequest {
  /** Organization ID the subaccount is created for. */
  organization: string;
}
