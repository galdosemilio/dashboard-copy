/**
 * GET /key/account/:id
 */

import { Entity, ItemEntity } from '../../../shared';

export interface KeyAccountSingle {
  /** ID of the key-organization-account association. */
  id: string;
  /** The default target quantity. */
  targetQuantity: number;
  /** Associated account data. */
  account: Entity;
  /** Associated organization data. */
  organization: Entity;
  /** Associated key data. */
  key: ItemEntity;
}
