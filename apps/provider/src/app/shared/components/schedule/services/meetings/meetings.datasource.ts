import { MeetingTypeWithColor } from '@app/service'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { FetchAllMeetingRequest, FetchAllMeetingResponse } from '@coachcare/sdk'
import { TableDataSource, Meeting } from '@app/shared/model'
import { Observable } from 'rxjs'
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
    this.getTotal(result)
    return result.data.map((element) => new Meeting(element, this.meetingTypes))
  }
}
