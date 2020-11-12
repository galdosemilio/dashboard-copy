import { Routes } from '@angular/router'
import { ClinicComponent } from './clinic/clinic.component'
import { ClinicsComponent } from './clinics.component'
import { ClinicResolver } from './services'

export const ClinicsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ClinicsComponent
  },
  {
    path: ':id',
    component: ClinicComponent,
    resolve: { clinic: ClinicResolver }
  }
]
