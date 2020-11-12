/**
 * Interface for Notifications
 */

import { PaginationResponse } from '../../common/entities'
import { AlertPreference } from '../entities'

export interface AlertPreferenceResponse {
  data: Array<AlertPreference>
  pagination: PaginationResponse
}
