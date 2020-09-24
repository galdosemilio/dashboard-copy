/**
 * GET /warehouse/sleep/basic
 */

import { Pagination } from '../../../shared';

export interface GetBasicSleepReportsResponse {
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
    /** Start date of given unit range. */
    date: string;
    /** Sleep data. */
    hoursSlept: {
      /** Sum of hours slept for given time range. */
      sum: number;
      /** Minimum of hours slept for given time range. */
      min: number;
      /** Maximum of hours slept for given time range. */
      max: number;
      /** Average of hours slept for given time range. */
      avg: number;
      /** Number of samples for given time range. */
      sampleCount: number;
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
