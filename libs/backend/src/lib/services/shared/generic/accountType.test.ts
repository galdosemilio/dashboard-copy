/**
 * Account Type
 */

import { createValidator } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import { AccountTypeDesc, AccountTypeInfo } from './accountType';

export const accountTypeTitle = t.union([
  t.literal('Client'),
  t.literal('Provider'),
  t.literal('Manager'),
  t.literal('Admin')
]);

export const accountTypeId = t.union([
  t.literal('1'),
  t.literal('2'),
  t.literal('3'),
  t.literal('4')
]);

export const accountTypeInfo = createValidator<AccountTypeInfo>({
  id: t.string,
  title: accountTypeTitle
});

export const accountTypeDesc = createValidator<AccountTypeDesc>({
  ...accountTypeInfo.type.props,
  description: t.string
});

export const accAccessType = t.union([t.literal('association'), t.literal('assignment')]);
