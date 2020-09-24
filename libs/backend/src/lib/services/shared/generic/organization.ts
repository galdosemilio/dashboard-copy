/**
 * Organization
 */

import { OrgEntity } from '../entities/orgEntity';
import { Color } from './color';
import { AddressItem, ContactItem } from './items';

export interface OrgRefOpt {
  id: string;
  name?: string;
}

// detailed
export interface OrgDetailed extends OrgEntity {
  contact?: ContactItem;
  address?: AddressItem;
}

// segment
export interface OrgSegment extends OrgEntity {
  address: Partial<AddressItem>;
}

// assets
export interface OrgAssets {
  logoUrl?: string;
  iconUrl?: string;
  splashUrl?: string;
  faviconUrl?: string;
  color: Partial<Color>;
}
