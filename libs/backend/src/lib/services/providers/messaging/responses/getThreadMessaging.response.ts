/**
 * GET /message/thread/:threadId
 */

import { MessagingItem, PagedResponse } from '../../../shared';

export type GetThreadMessagingResponse = PagedResponse<MessagingItem>;
