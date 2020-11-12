/**
 * POST /pain-tracking/history
 */

import { PainIntensity, PainLocation, PainTypeId } from '../entities'

export interface CreatePainTrackingRequest {
  /** Account id of specified user. */
  account: string
  /** Pain region: Chest | Throat |. */
  region: string
  /** Pain location - point information (x, y, z) */
  location: PainLocation
  /** Date-time of pain with time zone. */
  reportedAt: string
  /** Pain interval in hh:mm:ss format. */
  duration: string
  /** Pain type: 1-General | 2-Pounding | 3-Throbbing | 4-Stabbing. */
  type: PainTypeId
  /** Pain intensity in range [0, 10]. */
  intensity: PainIntensity
}
