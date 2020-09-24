/**
 * GET /account/:id/preference
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { calendarViewType } from '../../../shared/index.test';
import { AccountPreferenceSingle } from './accountPreference.single';

export const accountPreferenceSingle = createValidator({
  /** Calendar view preference. */
  calendarView: optional(calendarViewType),
  /** Default organization ID. */
  defaultOrganization: optional(t.string),
  /** Healthy badge station text. */
  healthyBadgeStation: optional(t.string)
});

export const accountPreferenceResponse = createTestFromValidator<AccountPreferenceSingle>(
  'AccountPreferenceSingle',
  accountPreferenceSingle
);
