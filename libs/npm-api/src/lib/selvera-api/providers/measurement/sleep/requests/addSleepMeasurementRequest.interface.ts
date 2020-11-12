/**
 * Interface for POST /measurement/sleep
 */

export interface AddSleepMeasurementRequest {
  clientId?: string
  deviceId: number
  sleep: Array<
    Array<{
      time: string
      quality: number
    }>
  >
}
