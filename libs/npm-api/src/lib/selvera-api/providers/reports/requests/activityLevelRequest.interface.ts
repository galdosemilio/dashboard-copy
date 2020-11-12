/**
 * Interface for GET /warehouse/step/activity/level
 */

import { ActivityLevelSort, AggregateLevel } from '../entities'

export interface ActivityLevelRequest {
  organization: string
  startDate: string
  endDate: string
  level: Array<AggregateLevel>
  limit?: 'all' | number
  offset?: number
  sort?: ActivityLevelSort
}
