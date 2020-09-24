/**
 * painType
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const painType = createValidator({
  /** Pain type id. */
  id: t.number,
  /** Pain type description. */
  description: t.string
});
