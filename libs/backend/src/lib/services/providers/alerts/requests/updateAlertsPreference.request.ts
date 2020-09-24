/**
 * PATCH /warehouse/alert/preference/:id
 */

export interface UpdateAlertsPreferenceRequest {
  /** Preference ID. */
  id: string;
  /** Preference object. */
  preference: any;
}
