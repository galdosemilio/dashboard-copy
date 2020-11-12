/**
 * GET /pain-tracking/history/:id
 */

import {
  IntervalObject,
  PainIntensity,
  PainLocation,
  PainType
} from '../entities'

export interface PainTrackingSingle {
  /** ID of specified pain location. */
  id: string
  /** Account id of specified user. */
  account: string
  /** Pain region: Chest | Throat | ... */
  region: string
  /** Pain location - point information (x, y, z) */
  location: PainLocation
  /** Datetime of pain with time zone. */
  reportedAt: string
  /** Pain interval information - at least one attribute will exist. */
  duration?: Partial<IntervalObject>
  /** Pain type id and description information. */
  type: PainType
  /** Pain intensity in range [0, 10]. */
  intensity: PainIntensity
}
