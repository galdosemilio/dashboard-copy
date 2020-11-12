/**
 * Interface for /warehouse/alert/preference
 */

import { AlertOrgPreference } from '../entities'

export interface CreateOrgAlertPreferenceRequest {
  organization: string
  alertType: string | number
  preference: AlertOrgPreference
}
