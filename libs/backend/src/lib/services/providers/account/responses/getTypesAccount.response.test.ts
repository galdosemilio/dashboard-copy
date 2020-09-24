/**
 * GET /account-type
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountTypeDesc } from '../../../shared/index.test';
import { GetTypesAccountResponse } from './getTypesAccount.response';

export const getTypesAccountResponse = createTest<GetTypesAccountResponse>(
  'GetTypesAccountResponse',
  {
    /** Account types object. */
    data: t.array(accountTypeDesc)
  }
);
