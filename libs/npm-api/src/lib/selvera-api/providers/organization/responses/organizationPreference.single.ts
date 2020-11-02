/**
 * GET /organization/:id/preference
 */

import {
  AppIds,
  OrganizationAssets,
  OrganizationFoodMode,
  SchedulePreferencesSingle
} from '../entities'

export interface OrganizationPreferenceSingle {
  /** ID of an organization the preference entry belongs to. */
  id?: string
  /** Display name of the organization. */
  displayName?: string
  /** Organization assets. */
  assets?: OrganizationAssets
  /** Enabled food-tracking modes. */
  food: {
    /** Enabled mode. */
    mode: Array<OrganizationFoodMode>
  }
  /** Schedule settings. */
  scheduling?: SchedulePreferencesSingle
  /** Whether the conference service is enabled or not. */
  conference: boolean
  /** Whether the content service is enabled or not. */
  content?: {
    /** Whether the content service is enabled or not. */
    enabled: boolean
  }
  /** App ID mapping. */
  appIds: Partial<AppIds>
  /** MALA settings. */
  mala?: any
}
