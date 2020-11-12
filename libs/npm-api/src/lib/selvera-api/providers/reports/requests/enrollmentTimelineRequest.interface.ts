/**
 * Interface for GET /warehouse/enrollment/accounts-by-organization/timeline
 */

import { TimelineUnit } from '../entities'

export interface EnrollmentTimelineRequest {
  organization: string
  startDate: string
  endDate: string
  detailed?: boolean
  unit: TimelineUnit
}
