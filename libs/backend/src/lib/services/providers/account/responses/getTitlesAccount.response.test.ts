/**
 * GET /account-title
 */

import { createTest } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountTitle } from '../../../shared/index.test';
import { GetTitlesAccountResponse } from './getTitlesAccount.response';

export const getTitlesAccountResponse = createTest<GetTitlesAccountResponse>(
  'GetTitlesAccountResponse',
  {
    /** Account title objects. */
    data: t.array(accountTitle)
  }
);
