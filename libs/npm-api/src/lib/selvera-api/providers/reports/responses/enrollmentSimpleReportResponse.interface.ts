/**
 * Interface for GET /warehouse/enrollment/simple
 */

import { PaginationResponse } from '../../common/entities'
import { SimpleEnrollmentItem } from '../entities'

export interface EnrollmentSimpleReportResponse {
  /** Collection of report items */
  data: Array<SimpleEnrollmentItem>
  /** Pagination object */
  pagination: PaginationResponse
}
