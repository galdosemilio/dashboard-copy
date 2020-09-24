/**
 * GET /conference/subaccount
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllConferenceSubaccountResponse } from './getAllConferenceSubaccount.response';

export const getAllConferenceSubaccountResponse = createTest<GetAllConferenceSubaccountResponse>(
  'GetAllConferenceSubaccountResponse',
  {
    /** Collection of subaccounts. */
    data: t.array(
      createValidator({
        /** Subaccount ID. */
        id: t.string,
        /** Subaccount creation timestamp. */
        createdAt: t.string,
        /** Subaccount latest modification timestamp. */
        updatedAt: optional(t.string),
        /** Activity flag. */
        isActive: t.boolean,
        /** A flag indicating if the subaccount has access keys set up for it. */
        hasKeys: t.boolean
      })
    )
  }
);
