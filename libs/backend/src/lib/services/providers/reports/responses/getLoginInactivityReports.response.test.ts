/**
 * GET /warehouse/login/inactivity
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { accountRef, accountTypeInfo, pagination } from '../../../shared/index.test';
import { GetLoginInactivityReportsResponse } from './getLoginInactivityReports.response';

export const getLoginInactivityReportsResponse = createTest<GetLoginInactivityReportsResponse>(
  'GetLoginInactivityReportsResponse',
  {
    /** Data collection. */
    data: t.array(
      createValidator({
        /** Account data. */
        account: accountRef,
        /** Organization data. */
        organization: createValidator({
          /** Organization ID. */
          id: t.string,
          /** Organization name. */
          name: t.string
        }),
        /** Account type data. */
        accountType: accountTypeInfo,
        /** Login bucket category, in days. */
        category: t.number,
        /** Last login timestamp. */
        lastLogin: t.string
      })
    ),
    /** Pagination object. */
    pagination: pagination
  }
);
