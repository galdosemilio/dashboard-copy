/**
 * country
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const country = createValidator({
  /** Country ID. */
  id: t.string,
  /** Country name. */
  name: t.string
});
