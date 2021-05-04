import { Injectable } from '@angular/core'
import { Consultation } from '@coachcare/sdk'

import {
  ConsultationListingRequest,
  ConsultationListingResponse
} from '@coachcare/sdk'

@Injectable()
export class ConsultationsDataService {
  constructor(private consultation: Consultation) {}

  public getNotes(
    req: ConsultationListingRequest
  ): Promise<ConsultationListingResponse[]> {
    return this.consultation.fetchAll(req)
  }
}
