import { ReportsCriteria } from '@app/dashboard/reports/services'

export interface ReportsControlsState {
  criteria: ReportsCriteria
}

export const initialState: ReportsControlsState = {
  criteria: {}
}
