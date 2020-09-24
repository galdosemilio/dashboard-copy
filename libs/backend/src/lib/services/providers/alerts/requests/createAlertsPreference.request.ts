/**
 * POST /warehouse/alert/preference
 */

export interface CreateAlertsPreferenceRequest {
  /** Organization ID. */
  organization: string;
  /** Alert type ID. */
  alertType: number;
  /** Preference object. */
  preference: {
    /** A flag indicating whether the alert should be active or not. */
    isActive: boolean;
    /** Alert-specific options. */
    options: any;
  };
}
