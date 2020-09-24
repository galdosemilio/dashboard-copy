/**
 * GET /access/account
 */

import { AccountAccessData, PagedResponse } from '../../../shared';

export type GetListAccountResponse = PagedResponse<AccountAccessData>;
