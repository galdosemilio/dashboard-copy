/**
 * Account
 */

import { MeasurementPreferenceType, PhoneType } from '../entities';
import { AccAccessType, AccountTypeId, AccountTypeInfo } from './accountType';

// account reference
export interface AccountRef {
  id: string;
  firstName: string;
  lastName: string;
}

export interface AccountEntity {
  id: string;
  firstName?: string;
  lastName?: string;
}

export interface AccountBasicRef extends AccountRef {
  email: string;
  accountType: AccountTypeId;
}

// account core data
export interface AccountCoreData {
  firstName: string;
  lastName: string;
  email: string;
}

// account
export interface AccountData extends AccountCoreData {
  id: string;
  accountType: AccountTypeInfo;
}

// account organization association data
export interface AccountAssociationData {
  id: string;
  name: string;
  accessType: AccAccessType;
  createdAt: string;
}

// account access data
export interface AccountAccessData extends AccountData {
  organizations: Array<AccountAssociationData>;
}

// account full data
export interface AccountFullData extends AccountData {
  createdAt: string;
  isActive: boolean;
  measurementPreference: MeasurementPreferenceType;
  timezone: string;
  phone: string | null;
  phoneType: PhoneType | null;
}

// account title ID (Bigint)
export type AccountTitleId = string;
