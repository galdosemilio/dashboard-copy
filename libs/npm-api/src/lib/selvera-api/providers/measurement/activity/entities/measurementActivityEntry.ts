/**
 * MeasurementActivityEntry
 */

import { Device } from './device';

export interface MeasurementActivityEntry {
    /** Actual activity date. */
    date: string;
    /** Steps value. */
    steps: number;
    /** Elevation value. */
    elevation?: number;
    /** Distance value. */
    distance?: number;
    /** Device/source that the steps were recorded with. */
    device: Device;
}
