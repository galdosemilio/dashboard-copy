/**
 * GET /message/thread/:threadId
 */

import { PageOffset, PageSize } from '../../content/entities';

export interface GetThreadMessagingRequest {
    /** The id of the record to fetch, passed as the last URI parameter. */
    threadId: string;
    /** A flag indicating a thread should be returned even if it is inactive. */
    inactive?: boolean;
    /** Page size. Can either be "all" (a string) or a number. */
    limit?: PageSize;
    /** Page offset. */
    offset?: PageOffset;
}
