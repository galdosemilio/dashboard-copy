/**
 * supplementItem
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const supplementItem = createValidator({
  /** ID of the supplement. */
  id: t.string,
  /** Full name of the supplement, in requested locale if available. */
  fullName: t.string,
  /** Short name of the supplement, in requested locale if available. */
  shortName: t.string,
  /** Supplement activity status flag. */
  isActive: t.boolean
});
