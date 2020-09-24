/**
 * GET /warehouse/alert/type
 */

import { Pagination } from '../../../shared';

export interface GetTypesAlertsResponse {
  /** Data collection. */
  data: Array<{
    /** Alert type ID. */
    id: number;
    /** Description. */
    description: string;
    /** Unique code. */
    code: string;
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
