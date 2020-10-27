import { RouterModule, Routes } from '@angular/router';

import { FileUploadGuard } from '@app/dashboard/content/services';
import {
  AuthGuard,
  ConferenceGuard,
  ListingPaginationGuard,
  OrphanedAccountGuard,
} from '@app/service';
import {
  ClinicsComponent,
  ContentComponent,
  // FaqsComponent,
  // MarketingComponent,
  FormsComponent,
  LibraryComponent,
  ProfileComponent,
  // SupportComponent
} from './';
import { CoachesRoutes } from './accounts/coaches/coaches.routing';
import { DietersRoutes } from './accounts/dieters/dieters.routing';
import { AlertsRoutes } from './alerts/alerts.routing';
import { LibraryRoutes } from './library';
import { DashPanelRoutes } from './panel/panel.routing';
import { ReportsRoutes } from './reports/reports.routing';
import { PlatformUpdatesComponent } from './resources';
import { SequencingRoutes } from './sequencing/sequencing.routing';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, OrphanedAccountGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', children: DashPanelRoutes },
      {
        path: 'accounts/patients',
        children: DietersRoutes,
        canDeactivate: [ListingPaginationGuard],
      },
      {
        path: 'accounts/coaches',
        children: CoachesRoutes,
        canDeactivate: [ListingPaginationGuard],
      },
      {
        path: 'accounts/clinics',
        component: ClinicsComponent,
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('./schedule/schedule.module').then((m) => m.ScheduleModule),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then((m) => m.MessagesModule),
      },
      {
        path: 'alerts',
        children: AlertsRoutes,
      },
      {
        path: 'reports',
        children: ReportsRoutes,
      },
      { path: 'sequences', children: SequencingRoutes },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'library',
        component: LibraryComponent,
        canDeactivate: [FileUploadGuard],
        children: LibraryRoutes,
      },
      {
        path: 'resources/platform-updates',
        component: PlatformUpdatesComponent,
      },
      // { path: 'resources/support', component: SupportComponent },
      // { path: 'resources/marketing', component: MarketingComponent },
      // { path: 'resources/faqs', component: FaqsComponent }
    ],
  },
];

export const DashboardRoutes = RouterModule.forChild(routes);
