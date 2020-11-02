/**
 * GET /message/thread
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetAllMessagingRequest {
    /** Array of account Id. */
    accounts?: Array<string>;
    /** Indicate if only threads with exclusively these account are returned. */
    accountsExclusive?: boolean;
    /** A flag, which set to 'true', that indicates to return only inactive threads. Returns only active threads by default. */
    inactive?: boolean;
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Page offset. */
    offset?: PageOffset;
}
