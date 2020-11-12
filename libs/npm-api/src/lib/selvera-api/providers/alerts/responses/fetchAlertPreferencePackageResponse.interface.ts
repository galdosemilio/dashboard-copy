import { PaginationResponse } from '../../common/entities'
import { AlertPreferencePackageAssociation } from '../entities'

/**
 * Interface for GET /warehouse/alert/preference/package
 */

export interface FetchAlertPreferencePackageResponse {
  /** Data collection */
  data: AlertPreferencePackageAssociation[]
  /** Pagination object */
  pagination: PaginationResponse
}
