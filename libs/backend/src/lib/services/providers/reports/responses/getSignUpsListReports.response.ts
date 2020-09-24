/**
 * GET /warehouse/organization/sign-ups/list
 */

import { Pagination } from '../../../shared';

export interface GetSignUpsListReportsResponse {
  /** Data collection. */
  data: Array<{
    /** Organization object. */
    organization: {
      /** The id of organization. */
      id: string;
      /** The name of organization. */
      name: string;
    };
    /** Client object. */
    account: {
      /** The id of client. */
      id: string;
      /** The first name of client. */
      firstName: string;
      /** The last name of client. */
      lastName: string;
    };
    /** Provider object. */
    assignedProvider?: {
      /** The id of provider. */
      id?: string;
      /** The first name of provider. */
      firstName?: string;
      /** The last name of provider. */
      lastName?: string;
    };
    /** Client association date. */
    startDate: string;
    /** Difference in weeks, fractional, between client's start date and selected endDate. */
    length: number;
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
