/**
 * GET /account-title
 */

import { ListResponse } from '../../common/entities'
import { AccountTitle } from '../entities'

export type GetTitlesAccountResponse = ListResponse<AccountTitle>
