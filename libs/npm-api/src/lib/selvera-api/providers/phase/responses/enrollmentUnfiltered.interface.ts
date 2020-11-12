/**
 * Interface for GET /package/enrollment
 */

export interface EnrollmentUnfiltered {
  id: string
  title: string
  shortcode: string
  package: string
  organization: string
  account: string
  enroll_start: string
  enroll_end: string | null
  first_name: string
  last_name: string
  email: string
  is_active: boolean
}
