/**
 * GET /access/account
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountAccessData, pagination } from '../../../shared/index.test';
import { GetListAccountResponse } from './getListAccount.response';

export const getListAccountResponse = createTest<GetListAccountResponse>('GetListAccountResponse', {
  /** Result collection. */
  data: t.array(accountAccessData),
  /** Pagination object. */
  pagination: pagination
});
