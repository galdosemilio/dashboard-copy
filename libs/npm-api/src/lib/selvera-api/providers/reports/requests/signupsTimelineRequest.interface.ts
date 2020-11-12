/**
 * Interface for GET /warehouse/organization/sign-ups/timeline
 */

import { TimelineUnit } from '../entities'

export interface SignupsTimelineRequest {
  organization: string
  startDate: string
  endDate: string
  detailed?: boolean
  unit: TimelineUnit
}
