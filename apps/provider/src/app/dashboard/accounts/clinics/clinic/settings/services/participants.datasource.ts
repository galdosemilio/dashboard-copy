import { MatPaginator } from '@coachcare/material'
import { Observable } from 'rxjs'

import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import {
  AutoThreadParticipant,
  GetOrgAutoThreadListingRequest,
  GetOrgAutoThreadParticipantListingResponse,
} from '@coachcare/npm-api'
import { ParticipantsCriteria } from './participants.criteria'
import { ParticipantDatabase } from './participants.database'
import * as moment from 'moment'

export class ParticipantsDataSource extends TableDataSource<
AutoThreadParticipant,
  GetOrgAutoThreadParticipantListingResponse,
  ParticipantsCriteria
> {
  constructor(
    protected notify: NotifierService,
    protected database: ParticipantDatabase,
    private paginator?: MatPaginator
  ) {
    super()

    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        offset: this.pageIndex * this.pageSize,
        limit: this.pageSize
      }))
    }
  }

  defaultFetch(): GetOrgAutoThreadParticipantListingResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: GetOrgAutoThreadListingRequest): Observable<GetOrgAutoThreadParticipantListingResponse> {
    return this.database.fetch(criteria)
  }

  mapResult(result: GetOrgAutoThreadParticipantListingResponse): Array<AutoThreadParticipant> {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

      for (const t of result.data) {
        t.createdAt = moment(t.createdAt).format('dddd, MMM D, YYYY')
      }

      return result.data
  }
}
