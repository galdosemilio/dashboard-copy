/**
 * authToken
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const authToken = createValidator({
  /** Authentication token creation date. */
  createdAt: t.string
});
