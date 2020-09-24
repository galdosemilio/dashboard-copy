/**
 * measurementActivitySegment
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { measurementActivityAggregates } from './measurementActivityAggregates.test';
import { measurementActivityEntry } from './measurementActivityEntry.test';

export const measurementActivitySegment = createValidator({
  /** Segment date. */
  date: t.string,
  /** Activity entries that are aggregated for the date. */
  entries: t.array(measurementActivityEntry),
  /** Calculated aggregates for the date. */
  aggregates: measurementActivityAggregates
});
