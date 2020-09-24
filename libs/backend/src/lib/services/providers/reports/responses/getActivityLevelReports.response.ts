/**
 * GET /warehouse/step/activity/level
 */

import { Pagination } from '../../../shared';

export interface GetActivityLevelReportsResponse {
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
    /** Steps data. */
    steps: {
      /** Average steps (daily) for given time range. */
      avg: number;
      /** Minimum steps (daily) for given time range. */
      min: number;
      /** Maximum steps (daily) for given time range. */
      max: number;
      /** Number of samples for given time range. */
      sampleCount: number;
    };
    /** Level data. */
    level: {
      /** assigned level ID. */
      name: string;
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
