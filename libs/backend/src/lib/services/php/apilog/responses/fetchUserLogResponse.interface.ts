/**
 * GET /log/:account
 */

import { PagedResponse } from '../../../shared';
import { UserLogEntry } from './userLogEntry.interface';

export type FetchUserLogResponse = PagedResponse<UserLogEntry>;
