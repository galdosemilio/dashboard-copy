import { DataPointTypes } from '@coachcare/sdk'

export interface PatientDashboardConfigDetails {
  SHOW_MY_SCHEDULE?: boolean
  SHOW_NEW_APPOINTMENT?: boolean
  ALLOWED_CHART_DATA_POINT_TYPES?: DataPointTypes[] | null
}
