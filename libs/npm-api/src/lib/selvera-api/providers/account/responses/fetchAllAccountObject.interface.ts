/**
 * Interface for object GET /account
 */
import { AccountMeasurementPreferenceType } from '../entities'

export interface FetchAllAccountObjectResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  accountType: number
  createdOn: string
  timezone: string
  measurementPreference: AccountMeasurementPreferenceType
}
