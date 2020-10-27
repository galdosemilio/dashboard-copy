import { AccListRequest } from '@app/shared/selvera-api';

export interface DietersCriteria extends AccListRequest {
  pageSize: any; // number | 'all';
}
