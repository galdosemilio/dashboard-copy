import { Entity } from '../../common/entities'

export interface AlertPreferencePackageAssociation {
  /** Association ID */
  id: string
  /** Associated package object */
  package: Entity
  /** Organization-level preference object */
  preference: Entity
}
