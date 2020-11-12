/**
 * Meeting Types
 */

export interface MeetingType {
  /** Type ID */
  id: string
  /** The code of the meeting type */
  code?: string
  /** The description of the meeting type */
  description: string
  /** Notification settings */
  notifications?: {
    /** The flag indicating whether notifications are enabled for given meeting type */
    enabled: boolean
  }
}
