import { MeetingTypeWithColor } from '@app/service'
import { TableDataSource } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { FetchAllMeetingRequest, FetchAllMeetingResponse } from '@coachcare/sdk'
import { Observable } from 'rxjs'
import { Meeting } from '../../models'
import { MeetingsDatabase } from './meetings.database'

export class MeetingsDataSource extends TableDataSource<
  any,
  FetchAllMeetingResponse,
  FetchAllMeetingRequest
> {
  constructor(
    protected database: MeetingsDatabase,
    private paginator?: CcrPaginatorComponent,
    private meetingTypes?: MeetingTypeWithColor[]
  ) {
    super()

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex !== undefined
            ? this.paginator.pageIndex
            : this.pageIndex) *
          (this.paginator.pageSize !== undefined
            ? this.paginator.pageSize
            : this.pageSize)
      }))
    }
  }

  defaultFetch(): FetchAllMeetingResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: FetchAllMeetingRequest): Observable<FetchAllMeetingResponse> {
    return this.database.fetch(criteria)
  }

  mapResult(result: FetchAllMeetingResponse): any[] | Promise<any[]> {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length
    return result.data.map((element) => new Meeting(element, this.meetingTypes))
  }
}
