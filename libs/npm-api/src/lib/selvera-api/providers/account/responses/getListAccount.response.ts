/**
 * GET /access/account
 */

import { PagedResponse } from '../../content/entities'
import { AccountAccessData } from '../entities'

export type GetListAccountResponse = PagedResponse<AccountAccessData>
