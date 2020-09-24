/**
 * GET /key/account/:id
 */

import { createTestFromValidator, createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { entity, itemEntity } from '../../../shared/index.test';
import { KeyAccountSingle } from './keyAccount.single';

export const keyAccountSingle = createValidator({
  /** ID of the key-organization-account association. */
  id: t.string,
  /** The default target quantity. */
  targetQuantity: t.number,
  /** Associated account data. */
  account: entity,
  /** Associated organization data. */
  organization: entity,
  /** Associated key data. */
  key: itemEntity
});

export const keyAccountResponse = createTestFromValidator<KeyAccountSingle>(
  'KeyAccountSingle',
  keyAccountSingle
);
