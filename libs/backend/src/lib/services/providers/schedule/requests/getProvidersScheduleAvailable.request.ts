/**
 * GET /available/match
 */

import { AvailabilityLookup } from '../../../shared';

export interface GetProvidersScheduleAvailableRequest {
  /** The array of provider id's whose availability will be searched. */
  providers: Array<string>;
  /** The time of day to search for. */
  preferredTime: AvailabilityLookup;
  /** The UTC offset to use when search for availability (-12 through 14) */
  offset: number;
}
