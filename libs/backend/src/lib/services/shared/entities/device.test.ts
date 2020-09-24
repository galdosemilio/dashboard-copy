/**
 * device
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const device = createValidator({
  /** ID of the device. */
  id: t.string,
  /** Name of the device. */
  name: t.string
});
