/**
 * GET /consent/tos
 */

import { createTest, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllConsentTosResponse } from './getAllConsentTos.response';

export const getAllConsentTosResponse = createTest<GetAllConsentTosResponse>(
  'GetAllConsentTosResponse',
  {
    data: createValidator({
      /** Content for the particular version of ToS. */
      content: t.string,
      /** String array of organizations. */
      organizations: t.array(t.string),
      /** Business-oriented version number of ToS. */
      version: t.number,
      /** Creation date of the ToS version. */
      createdAt: t.string
    }),
    meta: createValidator({
      /** A flag indicating whether the ToS should be accessible to anonymous/unauthenticated users. */
      allowAnonymousAccess: optional(t.boolean)
    })
  }
);
