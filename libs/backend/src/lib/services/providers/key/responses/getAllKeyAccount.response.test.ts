/**
 * GET /key/account
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { activityEntity, orgEntity } from '../../../shared/index.test';
import { accountSingle } from '../../account/responses/account.single.test';

export const getAllKeyAccountResponse = t.array(
  createValidator({
    /** ID of the key-organization-account association. */
    id: t.string,
    /** The default target quantity. */
    targetQuantity: t.number,
    /** Associated account data. */
    account: accountSingle,
    /** Associated organization data. */
    organization: orgEntity,
    /** Associated key data. */
    key: activityEntity
  })
);
