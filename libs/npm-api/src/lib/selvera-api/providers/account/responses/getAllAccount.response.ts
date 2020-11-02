/**
 * GET /account
 */

import { PagedResponse } from '../../content/entities'
import { AccountFullData } from '../entities'

export type GetAllAccountResponse = PagedResponse<AccountFullData>
