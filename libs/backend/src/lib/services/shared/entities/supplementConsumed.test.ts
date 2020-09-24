/**
 * supplementConsumed
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const supplementConsumed = createValidator({
  /** The ID of the supplement taken. */
  id: t.string,
  /** The name of the supplement taken. */
  name: t.string,
  /** The short name of the supplement taken. */
  shortName: t.string
});
