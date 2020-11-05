import { AccListRequest } from '@coachcare/npm-api'

export interface DietersCriteria extends AccListRequest {
  pageSize: any // number | 'all';
}
