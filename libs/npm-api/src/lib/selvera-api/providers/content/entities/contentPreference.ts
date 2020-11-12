import { Entity } from '../../common/entities'

export interface ContentPreferenceSingle {
  /** A flag indicating if the preference is active or not for the Organization */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
}
