/**
 * Interface for GET /package/enrollment (response)
 */

import { EnrollmentUnfiltered } from './enrollmentUnfiltered.interface'

export interface FetchEnrollmentsUnfiltered {
  entries: Array<EnrollmentUnfiltered>
  pagination: {
    next?: number
    prev?: number
  }
}
