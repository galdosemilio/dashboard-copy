/**
 * GET /account
 */

import { AccountFullData, PagedResponse } from '../../../shared';

export type GetAllAccountResponse = PagedResponse<AccountFullData>;
