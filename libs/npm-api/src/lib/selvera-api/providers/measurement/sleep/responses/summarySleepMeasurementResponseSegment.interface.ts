/**
 * Interface for single day|week|month of data for sleep summary section
 */

export interface SummarySleepMeasurementResponseSegment {
    date: string;
    sleepMinutes?: number;
    sleepQuality?: number;
    averageMinutes?: number;
}
