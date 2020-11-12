/**
 * Interface for GET /warehouse/enrollment/simple
 */
import { DateRange } from '../entities'

export interface EnrollmentSimpleReportRequest {
  /** The ID of the organization */
  organization: string
  /** The date range */
  range: DateRange
  /** A collection of packages for which enrollments should be checked for existence for each account */
  pkg?: Array<number>
  /** Enrollment fetch limit. Can be "all" if all active enrollments should be fetched. */
  enrollmentLimit?: number | 'all'
  /** Page size. Can either be "all" (a string) or a number */
  limit?: number | 'all'
  /** Page offset */
  offset?: number
}
