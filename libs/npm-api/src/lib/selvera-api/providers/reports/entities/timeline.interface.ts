/**
 * Timeline
 */

export interface TimelineSegment<T> {
    date: string;
    aggregates: Array<T>;
}
