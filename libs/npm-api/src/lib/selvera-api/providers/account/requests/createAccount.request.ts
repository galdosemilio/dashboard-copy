/**
 * POST /account
 */

import {
  AccountMeasurementPreferenceType,
  AccountTitleId,
  AccountTypeId,
  PhoneType
} from '../entities'

export interface CreateAccountRequest {
  /** Account title ID. */
  title?: AccountTitleId
  /** First name. */
  firstName: string
  /** Last name. */
  lastName: string
  /** Email address. */
  email: string
  /** An ID of the account type. */
  accountType: AccountTypeId
  /** Phone number. */
  phone: string
  /** Phone type. */
  phoneType?: PhoneType
  /** Measurement preference. */
  measurementPreference?: AccountMeasurementPreferenceType
  /** Account timezone. */
  timezone?: string
  /** List of preferred languages/locales. Should be provided in an appropriate order. */
  preferredLocales?: Array<string>
  /** Client profile data. Required for client profiles (accountType = '3') */
  client?: ClientData
}
