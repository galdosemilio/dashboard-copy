import { AccListRequest } from '@app/shared/selvera-api/';

export interface CoachesCriteria extends AccListRequest {
  offset: number;
}
