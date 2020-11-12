/**
 * FormAddendumRef
 */

import { Entity } from '../../common/entities'

export interface FormAddendumRef {
  /** Addendum ID. */
  id: string
  /** Account. */
  account: Entity
  /** Addendum text content. */
  content: string
  /** Timestamp indicating when the addendum was created. */
  createdAt: string
}
