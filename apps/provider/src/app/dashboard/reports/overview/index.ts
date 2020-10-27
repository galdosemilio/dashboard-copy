export * from './active-users/active-users.component';
export * from './overview.component';
export * from './enrollment-chart/enrollment-chart.component';
export * from './signups/chart/signups-chart.component';
export * from './signups/signups.component';

import { ActiveUsersComponent } from './active-users/active-users.component';
import { EnrollmentChartComponent } from './enrollment-chart/enrollment-chart.component';
import { OverviewComponent } from './overview.component';
import { SignupsChartComponent } from './signups/chart/signups-chart.component';
import { SignupsComponent } from './signups/signups.component';

export const OverviewComponents = [
  ActiveUsersComponent,
  EnrollmentChartComponent,
  OverviewComponent,
  SignupsComponent,
  SignupsChartComponent
];
