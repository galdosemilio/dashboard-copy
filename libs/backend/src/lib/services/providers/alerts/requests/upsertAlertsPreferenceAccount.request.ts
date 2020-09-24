/**
 * PUT /warehouse/alert/preference/:id/account
 */

export interface UpsertAlertsPreferenceAccountRequest {
  /** Preference ID. */
  id: string;
  /** Account ID. */
  account: string;
  /** Preference object. */
  preference: any;
}
