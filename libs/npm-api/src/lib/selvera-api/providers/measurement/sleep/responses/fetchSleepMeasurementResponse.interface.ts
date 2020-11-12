/**
 * Interface for GET /measurement/sleep (response)
 */

export interface FetchSleepMeasurementResponse {
  id: number
  userId: number
  recordedAt: string
  sleepDate: string
  timezone?: string
  sleepStart?: string
  sleepEnd?: string
  total?: number
  timeToSleep?: number
  wakeUpCount?: number
  deepSleep?: number
  wakeUp?: number
  lightSleep?: number
  remSleep?: number
  source?: number
}
