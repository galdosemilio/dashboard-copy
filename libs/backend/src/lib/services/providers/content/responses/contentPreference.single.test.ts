/**
 * GET /content/preference
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity } from '../../../shared/index.test';
import { ContentPreferenceSingle } from './contentPreference.single';

export const contentPreferenceSingle = createValidator({
  /** Organization entry. */
  organization: entity,
  /** A flag indicating if the preference entry is active or not. */
  isActive: t.boolean
});

export const contentPreferenceResponse = createTestFromValidator<ContentPreferenceSingle>(
  'ContentPreferenceSingle',
  contentPreferenceSingle
);
