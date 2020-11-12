/**
 * Interface for GET /meeting (response)
 */

import { FetchMeetingResponse } from './fetchMeetingResponse.interface'

export interface FetchAllMeetingResponse {
  data: Array<FetchMeetingResponse>
  pagination: {
    next?: number
    prev?: number
  }
}
