/**
 * scheduleCalendarSegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';

export const scheduleCalendarSegment = createValidator({
  /**
   * Calendar availability entry ID array. A single entry in an array indicates an actual calendar entry.
   * More than one entry in the collection indicates that the entry has been merged with another entry.
   */
  ids: t.array(t.string),
  /** Account ID. */
  account: t.string,
  /** Start time of availability window in UTC. */
  startTime: t.string,
  /** End time of availability window in UTC. */
  endTime: t.string,
  /** Account timezone. */
  timezone: t.string,
  /** Indicates whether the item is a non-recurring availability entry. */
  isSingle: t.boolean
});
