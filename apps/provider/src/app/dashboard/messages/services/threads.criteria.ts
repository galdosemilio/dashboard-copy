import { GetAllMessagingRequest } from '@app/shared/selvera-api';

export interface ThreadsCriteria extends GetAllMessagingRequest {
  accounts: Array<string>;
  limit: number;
  offset: number;
}
