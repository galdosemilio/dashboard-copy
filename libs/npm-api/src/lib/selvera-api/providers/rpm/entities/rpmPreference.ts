import { Entity } from '../../common/entities'

export interface RPMPreferenceSingle {
  /** RPM preference ID */
  id: string
  /** A flag that determines if the RPM notifications are active for the Organization */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
}
