/**
 * GET /conference/subaccount
 */

export interface GetAllConferenceSubaccountResponse {
  /** Collection of subaccounts. */
  data: Array<{
    /** Subaccount ID. */
    id: string;
    /** Subaccount creation timestamp. */
    createdAt: string;
    /** Subaccount latest modification timestamp. */
    updatedAt?: string;
    /** Activity flag. */
    isActive: boolean;
    /** A flag indicating if the subaccount has access keys set up for it. */
    hasKeys: boolean;
  }>;
}
