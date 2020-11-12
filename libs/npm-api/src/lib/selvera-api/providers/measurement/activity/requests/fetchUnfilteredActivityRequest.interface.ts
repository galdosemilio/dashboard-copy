/**
 * Interface for unfiltered GET /measurement/activity
 */

export interface FetchUnfilteredActivityRequest {
  clientId?: string
  start_date?: string
  end_date?: string
  direction?: string
  max?: number | 'all'
  device?: number
}
