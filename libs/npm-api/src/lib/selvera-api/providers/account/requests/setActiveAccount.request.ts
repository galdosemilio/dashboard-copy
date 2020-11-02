/**
 * PATCH /account/:id/activity
 */

export interface SetActiveAccountRequest {
  /** The user account to update.  This is passed as URI parameter. */
  id: string;
  /** The status of account.  This is passed as body param. */
  isActive: boolean;
}
