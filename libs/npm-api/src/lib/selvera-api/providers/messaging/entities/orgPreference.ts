import { Entity } from '../../common/entities'

export interface MessagingOrgPreference {
  /** Preference ID */
  id: string
  /** A flag indicating if the Messaging service is active or not for the Organization */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
  /** A flag indicating if the auto thread participation is active or not for the Organization */
  useAutoThreadParticipation?: boolean
}
