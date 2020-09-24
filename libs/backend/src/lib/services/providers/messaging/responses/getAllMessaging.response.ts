/**
 * GET /message/thread
 */

import { MessagingThread, PagedResponse } from '../../../shared';

export type GetAllMessagingResponse = PagedResponse<MessagingThread>;
