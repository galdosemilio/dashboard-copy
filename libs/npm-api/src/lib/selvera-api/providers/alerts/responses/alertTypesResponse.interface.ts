/**
 * Interface for Notifications
 */

import { PaginationResponse } from '../../common/entities'
import { AlertType } from '../entities'

export interface AlertTypesResponse {
  data: Array<AlertType>
  pagination: PaginationResponse
}
