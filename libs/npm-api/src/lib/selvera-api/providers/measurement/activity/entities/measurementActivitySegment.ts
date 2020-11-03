/**
 * MeasurementActivitySegment
 */

import { MeasurementActivityAggregates } from './measurementActivityAggregates';
import { MeasurementActivityEntry } from './measurementActivityEntry';

export interface MeasurementActivitySegment {
    /** Segment date. */
    date: string;
    /** Activity entries that are aggregated for the date. */
    entries: Array<MeasurementActivityEntry>;
    /** Calculated aggregates for the date. */
    aggregates: MeasurementActivityAggregates;
}
