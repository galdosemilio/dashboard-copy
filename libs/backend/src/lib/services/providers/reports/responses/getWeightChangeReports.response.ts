/**
 * GET /warehouse/weight/change
 */

import { Pagination } from '../../../shared';

export interface GetWeightChangeReportsResponse {
  /** Data collection. */
  data: Array<{
    /** User account data. */
    account: {
      /** User ID. */
      id: string;
      /** First name of the client. */
      firstName: string;
      /** Last name of the client. */
      lastName: string;
    };
    /** Organization data. */
    organization: {
      /** Organization ID. */
      id: string;
      /** Organization name. */
      name: string;
    };
    /** Weight change data. */
    change: {
      /** Absolute value of the weight change between the first & last weigh in the provided date range. */
      value: string;
      /** Percentage change of the weight, in respect to starting weight, between the first & last weigh in the provided date range. */
      percentage: string;
      /** Count of weigh-ins (samples) in the given date range. */
      weighInCount: string;
    };
    /** Assigned provider data. */
    assignedProvider?: {
      /** Provider account ID. */
      id: string;
      /** First name of the provider. */
      firstName: string;
      /** Last name of the provider. */
      lastName: string;
    };
  }>;
  /** Pagination object. */
  pagination: Pagination;
}
