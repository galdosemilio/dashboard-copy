/**
 * DELETE /warehouse/alert/preference/:id/account/:account
 */

export interface DeleteAlertsPreferenceAccountRequest {
  /** Preference ID. */
  id: string;
  /** Account ID. */
  account: string;
}
