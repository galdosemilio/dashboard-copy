/**
 * Interface for EnrollmentAggregate
 */
import { ReportOrganization } from '../../common/entities'
import { TimelineEnrollments } from './timelineAggregate.interface'

export interface EnrollmentAggregate {
  enrollments: Array<TimelineEnrollments>
  organization: ReportOrganization & {
    clientCount: number
  }
}
