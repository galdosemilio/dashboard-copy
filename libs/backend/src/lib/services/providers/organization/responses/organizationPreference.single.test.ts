/**
 * GET /organization/:id/preference
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { appIds, foodTrackingMode, orgAssets } from '../../../shared/index.test';
import { schedulePreferencesSingle } from '../../schedule/responses/schedulePreferences.single.test';
import { OrganizationPreferenceSingle } from './organizationPreference.single';

export const organizationPreferenceSingle = createValidator({
  /** ID of an organization the preference entry belongs to. */
  id: optional(t.string),
  /** Display name of the organization. */
  displayName: optional(t.string),
  /** Organization assets. */
  assets: optional(orgAssets),
  /** Enabled food-tracking modes. */
  food: createValidator({
    /** Enabled mode. */
    mode: t.array(foodTrackingMode)
  }),
  /** Schedule settings. */
  scheduling: optional(schedulePreferencesSingle),
  /** Whether the conference service is enabled or not. */
  conference: t.boolean,
  /** Whether the content service is enabled or not. */
  content: optional(
    createValidator({
      /** Whether the content service is enabled or not. */
      enabled: t.boolean
    })
  ),
  /** App ID mapping. */
  appIds: appIds,
  /** MALA settings. */
  mala: optional(t.any)
});

export const organizationPreferenceResponse = createTestFromValidator<OrganizationPreferenceSingle>(
  'OrganizationPreferenceSingle',
  organizationPreferenceSingle
);
