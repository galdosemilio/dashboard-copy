/**
 * supplementItemLoc
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { supplementTranslation } from './supplementTranslation.test';

export const supplementItemLoc = createValidator({
  /** ID of the supplement. */
  id: t.string,
  /** Full name of the supplement. */
  fullName: t.string,
  /** Supplement abbreviated name. */
  shortName: t.string,
  /** Supplement activity status flag. */
  isActive: t.boolean,
  /** Translation list. */
  translations: t.array(supplementTranslation)
});
