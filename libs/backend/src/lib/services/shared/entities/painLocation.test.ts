/**
 * painLocation
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const painLocation = createValidator({
  /** X coordinate of pain location. */
  x: t.number,
  /** Y coordinate of pain location. */
  y: t.number,
  /** Z coordinate of pain location. */
  z: t.number
});
