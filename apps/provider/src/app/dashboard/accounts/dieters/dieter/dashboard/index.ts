import { DieterDashboardComponent } from './dashboard.component'
import { StatDiffComponent } from './stat-diff/stat-diff.component'
import { StatSingleComponent } from './stat-single/stat-single.component'
import {
  DefaultDieterSummaryBoxesComponent,
  NxtstimDieterSummaryBoxesComponent
} from './summary-boxes'

export * from './stat-diff/stat-diff.component'
export * from './stat-single/stat-single.component'
export * from './dashboard.component'
export * from './summary-boxes'

export const DieterDashboardComponents = [
  DieterDashboardComponent,
  StatDiffComponent,
  StatSingleComponent,
  DefaultDieterSummaryBoxesComponent,
  NxtstimDieterSummaryBoxesComponent
]
