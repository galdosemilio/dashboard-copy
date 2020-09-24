/**
 * measurementActivityEntry
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { device } from './device.test';

export const measurementActivityEntry = createValidator({
  /** Actual activity date. */
  date: t.string,
  /** Steps value. */
  steps: t.number,
  /** Elevation value. */
  elevation: optional(t.number),
  /** Distance value. */
  distance: optional(t.number),
  /** Device/source that the steps were recorded with. */
  device: device
});
