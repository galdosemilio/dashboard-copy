/**
 * Organization
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { orgEntity } from '../entities/orgEntity.test';
import { addressItem, contactItem } from './items.test';
import { OrgAssets, OrgDetailed, OrgRefOpt, OrgSegment } from './organization';

export const orgRefOpt = createValidator<OrgRefOpt>({
  id: t.string,
  name: optional(t.string)
});

// detailed
export const orgDetailed = createValidator<OrgDetailed>({
  ...orgEntity.type.props,
  contact: optional(contactItem),
  address: optional(addressItem)
});

// segment
export const orgSegment = createValidator<OrgSegment>({
  ...orgEntity.type.props,
  address: optional(t.partial(addressItem.type.props))
});

// assets
export const orgAssets = createValidator<OrgAssets>({
  logoUrl: optional(t.string),
  color: t.any
});
