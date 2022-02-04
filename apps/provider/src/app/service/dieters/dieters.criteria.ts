import { AccListRequest } from '@coachcare/sdk'

export interface DietersCriteria extends AccListRequest {
  pageSize: number | 'all'
}
