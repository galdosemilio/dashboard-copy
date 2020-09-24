/**
 * supplementTranslation
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const supplementTranslation = createValidator({
  /** Locale. */
  locale: t.string,
  /** Translated full name of the supplement. */
  fullName: optional(t.string),
  /** Translated short name of the supplement. */
  shortName: optional(t.string)
});
