/**
 * GET /organization/:id/preference
 */

import { AppIds, FoodTrackingMode, OrgAssets } from '../../../shared';
import { SchedulePreferencesSingle } from '../../schedule/responses/schedulePreferences.single';

export interface OrganizationPreferenceSingle {
  id?: string;
    /** Display name of the organization */
  displayName?: string;
  /** Organization assets */
  assets?: OrgAssets;
  /** Enabled food-tracking modes */
  food: {
      /** Enabled mode collection. Will be empty if no explicit preference is set for the hierarchy. */
      mode: Array<FoodTrackingMode>;
  };
  /** Scheduling settings object. Will be missing if no explicit preference is set for the hierarchy. */
  scheduling?: SchedulePreferencesSingle;
  /** Conference preference object. Will be missing if no explicit preference is set for the hierarchy. */
  conference?: {
      /** Whether the content service is enabled or not */
      enabled: boolean;
  };
  /** Digital library preference object.  Will be missing if no explicit preference is set for the hierarchy. */
  content?: {
      /** Whether the content service is enabled or not */
      enabled: boolean;
  };
  /** App ID mapping. */
  appIds: Partial<AppIds>;
  /** MALA settings */
  mala?: any;
}
