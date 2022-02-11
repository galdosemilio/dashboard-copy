import { RouterModule, Routes } from '@angular/router'
import { FileUploadGuard } from '@app/dashboard/content/services'
import {
  AuthGuard,
  ListingPaginationGuard,
  OrphanedAccountGuard,
  PatientAccountGuard,
  ProviderAccountGuard
} from '@app/service'
import { LibraryComponent, ProfileComponent } from './'
import { ClinicsRoutes } from './accounts/clinics/clinics.routing'
import { CoachesRoutes } from './accounts/coaches/coaches.routing'
import { DietersRoutes } from './accounts/dieters/dieters.routing'
import { AlertsRoutes } from './alerts/alerts.routing'
import { LibraryRoutes } from './library'
import { NewAppointmentComponent } from './new-appointment'
import { DashPanelRoutes } from './panel/panel.routing'
import { ReportsRoutes } from './reports/reports.routing'
import { PlatformUpdatesComponent } from './resources'
import { SequencingRoutes } from './sequencing/sequencing.routing'

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
        canActivate: [ProviderAccountGuard],
        canDeactivate: [ListingPaginationGuard]
      },
      {
        path: 'accounts/coaches',
        children: CoachesRoutes,
        canActivate: [ProviderAccountGuard],
        canDeactivate: [ListingPaginationGuard]
      },
      {
        path: 'accounts/clinics',
        canActivate: [ProviderAccountGuard],
        children: ClinicsRoutes
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('./schedule/schedule.module').then((m) => m.ScheduleModule)
      },
      {
        path: 'file-vault',
        loadChildren: () =>
          import('./file-vault/file-vault.module').then(
            (m) => m.FileVaultModule
          )
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('./messages/messages.module').then((m) => m.MessagesModule)
      },
      {
        path: 'test-results',
        loadChildren: () =>
          import('./test-results/test-results.module').then(
            (m) => m.TestResultsModule
          )
      },
      {
        path: 'alerts',
        children: AlertsRoutes,
        canActivate: [ProviderAccountGuard]
      },
      {
        path: 'reports',
        children: ReportsRoutes,
        canActivate: [ProviderAccountGuard]
      },
      {
        path: 'sequences',
        children: SequencingRoutes,
        canActivate: [ProviderAccountGuard]
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'library',
        component: LibraryComponent,
        canDeactivate: [FileUploadGuard],
        children: LibraryRoutes
      },
      {
        path: 'resources/platform-updates',
        component: PlatformUpdatesComponent,
        canActivate: [ProviderAccountGuard]
      },
      {
        path: 'new-appointment',
        component: NewAppointmentComponent,
        canActivate: [PatientAccountGuard]
      }
      // { path: 'resources/support', component: SupportComponent },
      // { path: 'resources/marketing', component: MarketingComponent },
      // { path: 'resources/faqs', component: FaqsComponent }
    ]
  }
]

export const DashboardRoutes = RouterModule.forChild(routes)
