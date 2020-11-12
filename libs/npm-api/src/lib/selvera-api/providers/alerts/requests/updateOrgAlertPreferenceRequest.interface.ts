/**
 * Interface for PATCH /warehouse/alert/preference/:id
 */

import { AlertOrgPreference } from '../entities'

export interface UpdateOrgAlertPreferenceRequest {
  id: string | number
  preference: AlertOrgPreference
}
