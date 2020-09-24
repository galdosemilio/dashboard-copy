/**
 * GET /account/:id
 */

import { createTestFromValidator, createValidator, optional } from '@coachcare/backend/tests';
import * as t from 'io-ts';
import {
  accountTitle,
  accountTypeInfo,
  clientData,
  measurementPreferenceType,
  phoneType
} from '../../../shared/index.test';
import { AccountSingle } from './account.single';
import { accountPreferenceSingle } from './accountPreference.single.test';

export const accountSingle = createValidator({
  /** Account ID. */
  id: t.string,
  /** Account title. */
  title: optional(accountTitle),
  /** First name. */
  firstName: t.string,
  /** Last name. */
  lastName: t.string,
  /** Email. */
  email: t.string,
  /** Active flag. */
  isActive: t.boolean,
  /** Creation date. */
  createdAt: t.string,
  /** AccountType info. */
  accountType: accountTypeInfo,
  /** Measurement system. */
  measurementPreference: measurementPreferenceType,
  /** Timezone. */
  timezone: t.string,
  /** List of languages/locales in preferred order. */
  preferredLocales: t.array(t.string),
  /** Phone number. */
  phone: optional(t.string),
  /** Phone type. */
  phoneType: optional(phoneType),
  /** Client information. */
  clientData: optional(clientData),
  /** Account preferences. */
  preference: optional(t.partial(accountPreferenceSingle.type.props))
});

export const accountResponse = createTestFromValidator<AccountSingle>(
  'AccountSingle',
  accountSingle
);
