/**
 * GET /key/consumed
 */

import { ConsumedKeyItem, PagedResponse } from '../../../shared';

export type GetAllKeyConsumedResponse = PagedResponse<ConsumedKeyItem>;
