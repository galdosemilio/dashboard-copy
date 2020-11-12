/**
 * GET /account-type
 */

import { ListResponse } from '../../common/entities'
import { AccountTypeDesc } from '../entities'

export type GetTypesAccountResponse = ListResponse<AccountTypeDesc>
