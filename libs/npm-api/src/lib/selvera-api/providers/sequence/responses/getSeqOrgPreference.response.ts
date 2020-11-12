/**
 * Interface for GET /sequence/preference/organization/:id
 */

import { Entity } from '../../common/entities'

export interface GetSeqOrgPreferenceResponse {
  /** Creation timestamp */
  createdAt: string
  /** Preference ID */
  id: string
  /** A flag that indicates if the Preference is active or not */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
  /** Last update timestamp */
  updatedAt?: string
}
