import { RouterModule, Routes } from '@angular/router'
import {
  AuthGuard,
  OrphanedAccountGuard,
  PatientAccountGuard,
  ProviderAccountGuard
} from '@app/service'
import { NewAppointmentComponent } from './schedule'
import { DashPanelRoutes } from './panel/panel.routing'
import { ProfileComponent } from './profile'
import { PlatformUpdatesComponent } from './resources'
import { NgModule } from '@angular/core'
import { LibraryComponent } from './library'
import { FileUploadGuard } from './library/content/services'

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, OrphanedAccountGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', children: DashPanelRoutes },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then((m) => m.AccountsModule)
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
        loadChildren: () =>
          import('./alerts/alerts.module').then((m) => m.AlertsModule),
        canActivate: [ProviderAccountGuard]
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then((m) => m.ReportsModule),
        canActivate: [ProviderAccountGuard]
      },
      {
        path: 'sequences',
        loadChildren: () =>
          import('./sequencing/sequencing.module').then(
            (m) => m.SequencingModule
          ),
        canActivate: [ProviderAccountGuard]
      },
      { path: 'profile', component: ProfileComponent },
      {
        path: 'library',
        component: LibraryComponent,
        canDeactivate: [FileUploadGuard],
        loadChildren: () =>
          import('./library/library.module').then((m) => m.LibraryModule)
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
      },
      {
        path: 'store',
        loadChildren: () =>
          import('./ecommerce/ecommerce.module').then((m) => m.EcommerceModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
