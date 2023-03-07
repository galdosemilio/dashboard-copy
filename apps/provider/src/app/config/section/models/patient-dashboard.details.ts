import { DataPointTypes } from '@coachcare/sdk'
import { SectionConfigObject } from '../section.config'

export interface PatientDashboardConfigDetails {
  SHOW_MY_SCHEDULE?: boolean
  SHOW_NEW_APPOINTMENT?: boolean
  ALLOWED_CHART_DATA_POINT_TYPES?: DataPointTypes[] | null
  SUMMARY_BOXES?: SectionConfigObject
  SHOW_EXERCISE_MODERATE_TOTAL?: boolean
}
