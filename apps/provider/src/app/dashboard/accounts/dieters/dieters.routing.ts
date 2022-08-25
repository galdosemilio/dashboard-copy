import { RouterModule, Routes } from '@angular/router'
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
} from './index'

import { DieterListingNoPhiComponent } from './dieter-listing-no-phi/dieter-listing-no-phi.component'
import { DieterListingWithPhiComponent } from './dieter-listing-with-phi/dieter-listing-with-phi.component'
import { NgModule } from '@angular/core'

const routes: Routes = [
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
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DieterDashboardComponent },
      { path: 'settings', component: DieterSettingsComponent },
      { path: 'journal', component: DieterJournalComponent },
      { path: 'measurements', component: DieterMeasurementsComponent },
      { path: 'messages', component: DieterMessagesComponent }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DietersRoutingModule {}
