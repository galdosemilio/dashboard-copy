/**
 * GET /schedule/preferences/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountTypeId } from '../../../shared/index.test';
import { SchedulePreferencesSingle } from './schedulePreferences.single';

export const schedulePreferencesSingle = createValidator({
  /** Organization ID. */
  id: t.string,
  /**
   * An array of account type IDs (string values) indicating for which accounts the section should be disabled.
   * When it's missing, the section is available to everyone.
   */
  disabledFor: optional(t.array(accountTypeId))
});

export const schedulePreferencesResponse = createTestFromValidator<SchedulePreferencesSingle>(
  'SchedulePreferencesSingle',
  schedulePreferencesSingle
);
