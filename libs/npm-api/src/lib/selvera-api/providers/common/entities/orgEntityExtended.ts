/**
 * OrgEntityExtended
 */

import { NamedEntity } from './namedEntity'
import { OrgEntity } from './orgEntity'

export interface OrgAppInfo {
  id?: string
  /**
   * App store link
   */
  url?: string
  bundle?: string
}

export interface OrgEntityExtended extends OrgEntity {
  /** Organization active flag. */
  isActive: boolean
  /** Organization creation date. */
  createdAt: string
  app?: {
    name?: string
    ios?: OrgAppInfo
    android?: OrgAppInfo
  }
  plan?: NamedEntity
  parent?: NamedEntity
}
