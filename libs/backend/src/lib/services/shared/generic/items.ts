/**
 * Generic Items
 */

// address
export interface AddressItem {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// contact
export interface ContactItem {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// timezone
export interface TimezoneItem {
  name: string;
  abbreviation: string;
}
