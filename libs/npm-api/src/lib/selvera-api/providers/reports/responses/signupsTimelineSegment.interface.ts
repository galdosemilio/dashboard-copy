/**
 * Interface for /warehouse/organization/sign-ups/timeline
 */

import { TimelineSegment } from '../entities';
import { SignupsAggregate } from './signupsAggregate.interface';

export interface SignupsTimelineSegment extends TimelineSegment<SignupsAggregate> {
    date: string;
}
