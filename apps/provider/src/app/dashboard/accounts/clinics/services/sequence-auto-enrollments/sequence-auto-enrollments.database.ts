import { Injectable } from '@angular/core'
import { ContextService } from '@app/service'
import { bufferedRequests, CcrDatabase } from '@app/shared'
import {
  GetAllSequencesRequest,
  GetSequenceResponse,
  PagedResponse,
  Sequence
} from '@coachcare/sdk'

export interface GetAllSequencesRequestWithRefresh
  extends GetAllSequencesRequest {
  refresh?: boolean
}

export interface GetSequenceResponseWithExtras extends GetSequenceResponse {
  isAdmin?: boolean
}

@Injectable()
export class SequenceAutoEnrollmentsDatabase implements CcrDatabase {
  constructor(private context: ContextService, private sequence: Sequence) {}

  public async fetch(
    request: GetAllSequencesRequestWithRefresh
  ): Promise<PagedResponse<GetSequenceResponse>> {
    try {
      const response = await this.sequence.getAllSequences({
        ...request,
        autoenrollment: true
      })

      const allSequences: GetSequenceResponseWithExtras[] = response.data

      for (const seq of allSequences) {
        seq.isAdmin = await this.context.orgHasPerm(
          seq.organization.id,
          'admin'
        )
      }

      return { data: allSequences.slice(), pagination: response.pagination }
    } catch (error) {
      console.error(error)
      return { data: [], pagination: {} }
    }
  }
}
