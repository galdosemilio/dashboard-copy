/**
 * GET /account/:id
 */

import {
  AccountTitle,
  AccountTypeInfo,
  ClientData,
  MeasurementPreferenceType,
  PhoneType
} from '../../../shared';
import { AccountPreferenceSingle } from './accountPreference.single';

export interface AccountSingle {
  /** Account ID. */
  id: string;
  /** Account title. */
  title?: AccountTitle;
  /** First name. */
  firstName: string;
  /** Last name. */
  lastName: string;
  /** Email. */
  email: string;
  /** Active flag. */
  isActive: boolean;
  /** Creation date. */
  createdAt: string;
  /** AccountType info. */
  accountType: AccountTypeInfo;
  /** Measurement system. */
  measurementPreference: MeasurementPreferenceType;
  /** Timezone. */
  timezone: string;
  /** List of languages/locales in preferred order. */
  preferredLocales: Array<string>;
  /** Phone number. */
  phone?: string;
  /** Phone country code */
  countryCode: string;
  /** Phone type. */
  phoneType?: PhoneType;
  /** Client information. */
  clientData?: ClientData;
  /** Account preferences. */
  preference?: Partial<AccountPreferenceSingle>;
}
