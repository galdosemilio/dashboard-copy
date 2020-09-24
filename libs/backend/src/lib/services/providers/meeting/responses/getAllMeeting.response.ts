/**
 * GET /meeting
 */

import { MeetingItem, PagedResponse } from '../../../shared';

export type GetAllMeetingResponse = PagedResponse<MeetingItem>;
