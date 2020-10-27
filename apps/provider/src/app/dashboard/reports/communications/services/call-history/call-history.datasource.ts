import { CcrPaginator, TableDataSource } from '@app/shared';
import { FetchCallsRequest, FetchCallsResponse } from '@app/shared/selvera-api';
import { Observable } from 'rxjs';
import { CallHistoryItem } from '../../models';
import { CallHistoryDatabase } from './call-history.database';

export class CallHistoryDataSource extends TableDataSource<
  CallHistoryItem,
  FetchCallsResponse,
  FetchCallsRequest
> {
  constructor(protected database: CallHistoryDatabase, private paginator?: CcrPaginator) {
    super();
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }));
    }
  }

  defaultFetch(): FetchCallsResponse {
    return { data: [], pagination: {} };
  }

  fetch(criteria: FetchCallsRequest): Observable<FetchCallsResponse> {
    return this.database.fetch(criteria);
  }

  mapResult(response: FetchCallsResponse): CallHistoryItem[] {
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length;

    return response.data
      .reverse()
      .map((item) => new CallHistoryItem(item))
      .reverse();
  }
}
