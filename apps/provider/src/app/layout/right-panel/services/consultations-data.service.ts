import { Injectable } from '@angular/core'
import { Consultation } from 'selvera-api'

import {
  ConsultationListingRequest,
  ConsultationListingResponse
} from '@coachcare/npm-api'

@Injectable()
export class ConsultationsDataService {
  constructor(private consultation: Consultation) {}

  public getNotes(
    req: ConsultationListingRequest
  ): Promise<ConsultationListingResponse[]> {
    return this.consultation.fetchAll(req)
  }
}
