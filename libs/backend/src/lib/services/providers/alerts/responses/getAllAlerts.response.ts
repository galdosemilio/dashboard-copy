/**
 * GET /notification
 */

import { AlertItem, PagedResponse } from '../../../shared';

export type GetAllAlertsResponse = PagedResponse<AlertItem>;
