/**
 * GET /message/thread
 */

import { PagedResponse } from '../../content/entities'
import { MessagingThreadSegment } from '../entities'

export type GetAllMessagingResponse = PagedResponse<MessagingThreadSegment>
