/**
 * GET /notification
 */

import { AlertCategory, PageOffset, PageSize, TimestampFilter } from '../../../shared';

export interface GetAllAlertsRequest {
  /** Account filter of the recipient of the notification. Optional for Client requests, otherwise required. */
  account?: string;
  /** Organization for the notification. */
  organization: string;
  /** Filter for ID of the account that triggered the alert. */
  triggeredBy?: string;
  /** Creation timestamp filter. */
  createdAt?: Partial<TimestampFilter>;
  /** Category to filter by. Should be either 'none' or a number if specified. */
  category?: AlertCategory;
  /** Notification group ID filter. Can be set to `null` to only show notifications that do not have a group. */
  groupId?: string;
  /** An optional flag to only fetch read/unread notifications. */
  viewed?: boolean;
  /** Notification type filter. */
  type?: string;
  /** Page offset. */
  offset?: PageOffset;
  /** Page size. Can be set to 'all' to retrieve all entries. */
  limit?: PageSize;
}
