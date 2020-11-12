import { Routes } from '@angular/router'
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
  WeightChangeTableComponent
} from './'
import { CommunicationsReportComponent } from './communications'
import { CallsComponent } from './communications/calls'
import { RPMReportComponent } from './rpm'
import { RPMBillingComponent } from './rpm/rpm-billing'

export const ReportsRoutes: Routes = [
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
      { path: 'billing', component: RPMBillingComponent }
    ]
  }
]
