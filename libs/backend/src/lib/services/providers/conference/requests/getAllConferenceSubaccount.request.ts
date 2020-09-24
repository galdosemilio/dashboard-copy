/**
 * GET /conference/subaccount
 */

export interface GetAllConferenceSubaccountRequest {
  /** Organization ID to fetch the subaccounts for. */
  organization: string;
  /** A flag indicating whether to only retrieve active subaccounts. */
  activeOnly?: boolean;
}
