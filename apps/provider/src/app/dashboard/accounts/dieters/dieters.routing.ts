import { Routes } from '@angular/router';
import {
  DieterComponent,
  DieterDashboardComponent,
  DieterJournalComponent,
  DieterMeasurementsComponent,
  DieterMessagesComponent,
  DieterResolver,
  DieterSettingsComponent,
  DietersGuard,
  DietersNoPhiGuard,
  GoalsResolver
} from './index';

import { DieterListingNoPhiComponent } from './dieter-listing-no-phi/dieter-listing-no-phi.component';
import { DieterListingWithPhiComponent } from './dieter-listing-with-phi/dieter-listing-with-phi.component';

export const DietersRoutes: Routes = [
  {
    path: '',
    component: DieterListingWithPhiComponent,
    canActivate: [DietersGuard]
  },
  {
    path: 'nophi',
    component: DieterListingNoPhiComponent,
    canActivate: [DietersNoPhiGuard]
  },
  {
    path: ':id',
    component: DieterComponent,
    resolve: {
      goals: GoalsResolver,
      account: DieterResolver
    },
    children: [
      { path: '', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DieterDashboardComponent },
      { path: 'settings', component: DieterSettingsComponent },
      { path: 'journal', component: DieterJournalComponent },
      { path: 'measurements', component: DieterMeasurementsComponent },
      { path: 'messages', component: DieterMessagesComponent }
    ]
  }
];
