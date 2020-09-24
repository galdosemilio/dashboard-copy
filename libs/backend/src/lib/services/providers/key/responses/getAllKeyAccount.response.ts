/**
 * GET /key/account
 */

import { ActivityEntity, OrgEntity } from '../../../shared';
import { AccountSingle } from '../../account/responses/account.single';

export type GetAllKeyAccountResponse = Array<{
  /** ID of the key-organization-account association. */
  id: string;
  /** The default target quantity. */
  targetQuantity: number;
  /** Associated account data. */
  account: AccountSingle;
  /** Associated organization data. */
  organization: OrgEntity;
  /** Associated key data. */
  key: ActivityEntity;
}>;
