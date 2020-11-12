/**
 * Interface for OrgAccessResponse
 */

import { OrganizationAccess } from '../entities'
import { PaginationResponse } from './paginationResponse.interface'

export interface OrgAccessResponse {
  data: Array<OrganizationAccess>
  pagination: PaginationResponse
}
