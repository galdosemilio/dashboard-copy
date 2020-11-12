/**
 * PackageAssociation
 */

import { Entity } from '../../common/entities'
import { PackageData } from './packageData'

export interface PackageAssociation {
  /** ID of an organization-package association. */
  id: string
  /** Package-organization association activity status flag. */
  isActive: boolean
  /** Organization-specific sort order for this package. */
  sortOrder?: number
  /** Additional organization-specific data stored for this package. */
  payload?: any
  /** Organization object. */
  organization: Entity
  /** Timestamp of association creation. */
  createdAt: string
  /** Timestamp of association last update. */
  updatedAt: string
  /** Package data object. */
  package: PackageData
}
