/**
 * Interface for /warehouse/enrollment/accounts-by-organization/timeline
 */

import { TimelineSegment } from '../entities'
import { EnrollmentAggregate } from './enrollmentAggregate.interface'

export interface EnrollmentTimelineSegment
  extends TimelineSegment<EnrollmentAggregate> {
  date: string
}
