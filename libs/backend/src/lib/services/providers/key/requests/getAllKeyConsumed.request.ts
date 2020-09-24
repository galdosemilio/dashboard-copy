/**
 * GET /key/consumed
 */

import { PageOffset, PageSize } from '../../../shared';

export interface GetAllKeyConsumedRequest {
  /** The id of the account which consumed keys records are related with, if omitted on Client call, current user id is taken. */
  account?: string;
  /** Organization id to get hierarchy for and check which consumed key records are related with. */
  organization: string;
  /** Id of the key which consumed keys records are related with. */
  key?: string;
  /**
   * Start date parameter passed in YYYY-MM-DD format.
   * Start Date can be passed without endDate, then keys records starting from that date will be fetched.
   */
  startDate?: string;
  /** End date parameter passed in YYYY-MM-DD format. */
  endDate?: string;
  /** Number of records per page. Can either be "all" (a string) or a number. */
  limit?: PageSize;
  /** Number of records to offset. */
  offset?: PageOffset;
}
