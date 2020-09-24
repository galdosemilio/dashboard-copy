/**
 * intervalObject
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const intervalObject = createValidator({
  /** pain duration - hours. */
  hours: optional(t.number),
  /** pain duration - minutes. */
  minutes: optional(t.number),
  /** pain duration - seconds. */
  seconds: optional(t.number)
});
