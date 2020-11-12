/**
 * Interface for Base Enrollment
 */

export interface Enrollment {
  id: string
  title: string
  shortcode: string
  package: string
  organization: string
  startDate: string
  endDate: string | null
}
