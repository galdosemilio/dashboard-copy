/**
 * GET /log/:account
 */

import { PagedResponse } from '../../content/entities'
import { UserLogEntry } from './userLogEntry.interface'

export type FetchUserLogResponse = PagedResponse<UserLogEntry>
