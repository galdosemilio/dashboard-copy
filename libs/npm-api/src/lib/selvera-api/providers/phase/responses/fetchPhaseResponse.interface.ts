/**
 * Interface for Phase.fetch
 */

import { Enrollment } from './enrollment.interface'

export interface FetchPhaseResponse {
  current?: Enrollment
  initial?: Enrollment
}
