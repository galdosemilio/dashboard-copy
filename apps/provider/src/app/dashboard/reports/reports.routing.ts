import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import {
  ActiveUsersComponent,
  CoachStatsComponent,
  EnrollmentChartComponent,
  OverviewComponent,
  PatientActivityComponent,
  PatientStatsComponent,
  ReportsComponent,
  SignupsComponent,
  SleepTableComponent,
  StatisticsComponent,
  StepsChartComponent,
  WeightChangeTableComponent,
  CohortWeightLossComponent
} from './'
import { CommunicationsReportComponent } from './communications'
import { CallsComponent } from './communications/calls'
import { MessageActivityReportComponent } from './custom'
import { CustomReportsComponent } from './custom/custom-reports.component'
import { RPMReportComponent } from './rpm'
import { RPMBillingComponent } from './rpm/rpm-billing'
import { PatientBulkReportsComponent } from './rpm/patient-bulk-reports'

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent
  },
  {
    path: 'communications',
    component: CommunicationsReportComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'communications'
      },
      {
        path: 'communications',
        component: CallsComponent
      }
    ]
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'patient' },
      { path: 'patient', component: PatientStatsComponent },
      { path: 'coach', component: CoachStatsComponent },
      { path: 'cohort', component: CohortWeightLossComponent },
      {
        path: 'activity',
        component: PatientActivityComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'weight' },
          { path: 'weight', component: WeightChangeTableComponent },
          { path: 'sleep', component: SleepTableComponent },
          { path: 'steps', component: StepsChartComponent }
        ]
      }
    ]
  },
  {
    path: 'overview',
    component: OverviewComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'signups' },
      { path: 'signups', component: SignupsComponent },
      { path: 'enrollments', component: EnrollmentChartComponent },
      { path: 'active', component: ActiveUsersComponent }
    ]
  },
  {
    path: 'rpm',
    component: RPMReportComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'billing' },
      { path: 'billing', component: RPMBillingComponent },
      { path: 'patient-bulk-reports', component: PatientBulkReportsComponent }
    ]
  },
  {
    path: 'custom',
    component: CustomReportsComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'message-activity' },
      { path: 'message-activity', component: MessageActivityReportComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
