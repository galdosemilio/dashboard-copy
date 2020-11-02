/**
 * Interface for GET /mfa
 */

import { Entity, NamedEntity } from '../../common/entities'

export interface GetUserMFAResponse {
  /** The account entity */
  account: Entity
  /** The MFA channel */
  channel: NamedEntity
  /** ID of the instance */
  id: string
  /** A flag indicating if the method is verified or not */
  isVerified: boolean
  /** The organization entity */
  organization: Entity
}
