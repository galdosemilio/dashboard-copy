/**
 * Interface for PUT /sequence/:id/autoenrollment/preference
 */

export interface UpsertSeqAutoenrollmentPreference {
  /** ID of the sequence */
  id: string
  /** Timezone-local time for the enrollment, as HH:MM:SS */
  time: string
  /** Timezone (Olson format) for the enrollment. */
  timezone: string
  /** One of the offset structures to use */
  offset: { dayOfWeek: number } | { dayOfMonth: number } | { fixed: number }
  /** Transition to use for autoenrollment */
  transition?: string
}
