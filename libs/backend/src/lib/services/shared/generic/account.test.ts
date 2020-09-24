/**
 * Account
 */

import { createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import {
  AccountAccessData,
  AccountAssociationData,
  AccountCoreData,
  AccountData,
  AccountEntity,
  AccountFullData,
  AccountRef
} from './account';
// import { measurementPreferenceType, phoneType } from '../entities/index.test';
import { accountTypeInfo } from './accountType.test';

// account reference
export const accountRef = createValidator<AccountRef>({
  id: t.string,
  firstName: t.string,
  lastName: t.string
});

export const accountEntity = createValidator<AccountEntity>({
  id: t.string,
  firstName: optional(t.string),
  lastName: optional(t.string)
});

// account core data
export const accountCoreData = createValidator<AccountCoreData>({
  firstName: t.string,
  lastName: t.string,
  email: t.string
});

// account
export const accountData = createValidator<AccountData>({
  ...accountCoreData.type.props,
  id: t.string,
  accountType: accountTypeInfo
});

// account organization association data
export const accountAssociationData = createValidator<AccountAssociationData>({
  id: t.string,
  name: t.string,
  accessType: t.string,
  createdAt: t.string
});

// account access data
export const accountAccessData = createValidator<AccountAccessData>({
  ...accountData.type.props,
  organizations: t.array(accountAssociationData)
});

// account full data
export const accountFullData = createValidator<AccountFullData>({
  ...accountData.type.props,
  createdAt: t.string,
  isActive: t.boolean,
  measurementPreference: t.any, // measurementPreferenceType,
  timezone: t.string,
  phone: t.union([t.string, t.null]),
  phoneType: t.any // t.union([phoneType, t.null])
});

// account title ID (Bigint)
export const accountTitleId = t.string;
