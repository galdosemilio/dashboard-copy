/**
 * PATCH /account/:id
 */

import {
  AccountMeasurementPreferenceType,
  AccountTitleId,
  PhoneType
} from '../entities'

export interface UpdateAccountRequest {
  /** Account ID. Intended documentation rename of the URI parameter. */
  id: string
  /** Account title ID. */
  title?: AccountTitleId
  /** First name. */
  firstName?: string
  /** Last name. */
  lastName?: string
  /** Email address. */
  email?: string
  /** Phone number. */
  phone?: string
  /** Phone type. */
  phoneType?: PhoneType
  /** Phone country code */
  countryCode?: string
  /** Measurement preference. */
  measurementPreference?: AccountMeasurementPreferenceType
  /** Account timezone. */
  timezone?: string
  /** List of preferred languages/locales. Should be provided in an appropriate order. */
  preferredLocales?: Array<string>
  /** Client profile data. */
  client?: Partial<ClientData>
}
