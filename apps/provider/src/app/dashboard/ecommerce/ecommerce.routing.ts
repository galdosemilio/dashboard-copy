import { Routes } from '@angular/router'
import { PatientAccountGuard } from '@app/service'
import { EcommerceComponent } from './ecommerce.component'

export const EcommerceRoutes: Routes = [
  {
    path: '',
    component: EcommerceComponent,
    canActivate: [PatientAccountGuard]
  }
]
