import { Entity } from '../../common/entities'

export interface CommunicationPreferenceSingle {
  /** Prefence ID */
  id: string
  /** A flag indicating if the Preference is active */
  isActive: boolean
  /** Organization Entity */
  organization: Entity
  /** Videoconferencing feature settings */
  videoConferencing: {
    /** A flag indicating if videoconferencing is enabled */
    isEnabled: boolean
  }
}
