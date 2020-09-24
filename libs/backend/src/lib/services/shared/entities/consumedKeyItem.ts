/**
 * ConsumedKeyItem
 */

import { Entity, NamedEntity } from '../generic';
import { KeyConsumedMeal } from './keyConsumedMeal';
import { OrgEntity } from './orgEntity';

export interface ConsumedKeyItem {
  /** The id of the consumed key record. */
  consumedId: string;
  /** The account that created this consumed key record. */
  account: Entity;
  /** The key that was consumed. */
  key: NamedEntity;
  /** The organization that key is assigned to. */
  organization: OrgEntity;
  /** Date and time the key was consumed, in ISO8601 format. */
  consumedAt: string;
  /** The timestamp of when the record was created. */
  createdAt: string;
  /** The number of units of this key that was consumed. */
  quantity: number;
  /** The consumed meal entry that the key-consumption entry is coming from. */
  consumedMeal?: KeyConsumedMeal;
}
