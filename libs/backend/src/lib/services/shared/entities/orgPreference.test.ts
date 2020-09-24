/**
 * orgPreference
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { color } from '../generic/index.test';

export const orgPreference = createValidator({
  /** ID of an organization the preference entry belongs to. */
  id: t.string,
  /** Full URL of the logo. */
  logoUrl: optional(t.string),
  /** Color information. */
  color: color
});
