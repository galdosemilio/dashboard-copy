/**
 * Interface for GET /sequence/organization/:id
 */

import { Entity } from '../../common/entities'

export interface GetSeqOrgAssociationResponse {
  /** Association creation timestamp */
  createdAt: string
  /** The ID of the user that created the Sequence */
  createdBy: Entity
  /** Association ID */
  id: string
  /** A flag indicating if the Association is active or not */
  isActive: boolean
  /** Sequence Entity */
  sequence: Entity
}
