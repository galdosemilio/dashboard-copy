/**
 * GET /account
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountFullData, pagination } from '../../../shared/index.test';
import { GetAllAccountResponse } from './getAllAccount.response';

export const getAllAccountResponse = createTest<GetAllAccountResponse>('GetAllAccountResponse', {
  /** Array of accounts. */
  data: t.array(accountFullData),
  /** Pagination object. */
  pagination: pagination
});
