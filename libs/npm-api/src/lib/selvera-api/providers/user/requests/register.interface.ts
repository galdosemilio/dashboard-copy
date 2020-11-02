/**
 * Interface for POST /register/
 */

import { UserMeasurementPreferenceType } from './userMeasurementPreference.type'
import { UserDeviceType } from './login.interface'

export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  clientPhone: string
  clientBirthday: string
  clientGender: 'male' | 'female'
  clientHeight: number
  timezone: string
  measurementPreference: UserMeasurementPreferenceType
  organizations?: Array<number>
  organizationShortcodes?: Array<string>
  welcomeEmail?: boolean
  welcomeEmails?: Array<string>
  options?: Object
  deviceType: UserDeviceType
  phoneType?: 'ios' | 'android'
  clinic?: string
}
