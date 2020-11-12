/**
 * Interface for POST /measurement/activity
 */

export interface AddActivityRequest {
  clientId?: string
  activity: Array<{
    date: string
    device: number
    steps: number
    timezone?: string
    distance?: number
    calories?: number
    elevation?: number
    soft?: number
    moderate?: number
    intense?: number
  }>
}
