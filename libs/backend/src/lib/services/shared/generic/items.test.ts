/**
 * Generic Items
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { AddressItem, ContactItem, TimezoneItem } from './items';

// address
export const addressItem = createValidator<AddressItem>({
  street: t.string,
  city: t.string,
  state: t.string,
  postalCode: t.string,
  country: t.string
});

// contact
export const contactItem = createValidator<ContactItem>({
  email: t.string,
  firstName: t.string,
  lastName: t.string,
  phone: optional(t.string)
});

// timezone
export const timezoneItem = createValidator<TimezoneItem>({
  name: t.string,
  abbreviation: t.string
});
