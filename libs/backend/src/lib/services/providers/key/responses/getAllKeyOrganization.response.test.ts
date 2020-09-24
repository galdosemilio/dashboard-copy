/**
 * GET /key/organization
 */

import { createTest, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { GetAllKeyOrganizationResponse } from './getAllKeyOrganization.response';

export const getAllKeyOrganizationResponse = createTest<GetAllKeyOrganizationResponse>(
  'GetAllKeyOrganizationResponse',
  {
    /** ID of the key-organization association. */
    id: t.string,
    /** ID of the organization. */
    organizationId: t.string,
    /** Key-organization data. */
    key: createValidator({
      /** ID of the key. */
      id: t.string,
      /** Key's name. */
      name: t.string,
      /** Key's description. */
      description: t.string,
      /** Key activity status flag. */
      isActive: t.boolean
    }),
    /** The default target quantity. */
    targetQuantity: t.number
  }
);
