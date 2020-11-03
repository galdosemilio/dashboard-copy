/**
 * GET /message/thread/:threadId
 */

import { PagedResponse } from '../../content/entities';
import { MessagingItem } from '../entities';

export type GetThreadMessagingResponse = PagedResponse<MessagingItem>;
