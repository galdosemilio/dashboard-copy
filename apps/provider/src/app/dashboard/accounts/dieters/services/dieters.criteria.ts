import { AccListRequest } from '@coachcare/sdk'

export interface DietersCriteria extends AccListRequest {
  pageSize: any // number | 'all';
}
