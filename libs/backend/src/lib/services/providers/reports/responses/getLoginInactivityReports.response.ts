/**
 * GET /warehouse/login/inactivity
 */

import { AccountRef, AccountTypeInfo, Pagination } from '../../../shared';

export interface GetLoginInactivityReportsResponse {
  /** Data collection. */
  data: Array<{
    /** Account data. */
    account: AccountRef;
    /** Organization data. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization name. */
      name: string;
    };
    /** Account type data. */
    accountType: AccountTypeInfo;
    /** Login bucket category, in days. */
    category: number;
    /** Last login timestamp. */
    lastLogin: string;
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
