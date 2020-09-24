/**
 * timestampFilter
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const timestampFilter = createValidator({
  /** Includes notifications created after start time. */
  start: optional(t.string),
  /** Includes notifications created before end time. */
  end: optional(t.string)
});
