export interface SequenceAutoEnrollmentOptions {
  /** A flag indicating if autoenrollment is enabled */
  enabled: boolean
  /** Custom autoenrollment preferences */
  preference?: {
    /** Enrollment time offset */
    offset: string
    /** Desired transition execution start time, in local time. */
    time: string
    /** Execution start time timezone */
    timezone: string
    transition: string
  }
}
