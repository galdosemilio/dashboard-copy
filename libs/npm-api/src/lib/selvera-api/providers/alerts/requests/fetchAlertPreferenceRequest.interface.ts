/**
 * Interface for /hwarehouse/alert/preference
 */

export interface FetchAlertPreferenceRequest {
  organization: string
  account?: string | number
  alertType?: string | number
  limit?: 'all' | number
  offset?: number
}
