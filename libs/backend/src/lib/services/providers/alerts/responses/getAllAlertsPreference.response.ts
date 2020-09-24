/**
 * GET /warehouse/alert/preference
 */

import { AlertType, Pagination } from '../../../shared';

export interface GetAllAlertsPreferenceResponse {
  /** Data collection. */
  data: Array<{
    /** Preference ID. */
    id: number;
    /** Alert type. */
    type: AlertType;
    /** Organization preference. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization preference entry. */
      preference: {
        /** Alert options. Value and expected structure depends on the alert type the options are set for. */
        options: any;
        /** Preference activity indicator. */
        isActive: boolean;
      };
    };
    /** Organization-account preference. Only provided when 'account' parameter is passed. */
    account?: {
      /** Organization-account preference entry. */
      preference: {
        /** Alert options. Value and expected structure depends on the alert type the options are set for. */
        options: any;
        /** Preference activity indicator. */
        isActive: boolean;
      };
    };
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
