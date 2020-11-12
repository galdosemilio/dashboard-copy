/**
 * Interface for GET /note/consultation (response)
 */

import { FetchConsultationNoteResponse } from './fetchConsultationNoteResponse.interface'
import { PaginationResponse } from './paginationResponse.interface'

export interface FetchAllConsultationNotesResponse {
  data: Array<FetchConsultationNoteResponse>
  pagination: PaginationResponse
}
