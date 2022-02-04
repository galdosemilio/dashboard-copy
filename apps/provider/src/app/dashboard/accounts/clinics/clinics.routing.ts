import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ClinicComponent } from './clinic/clinic.component'
import { ClinicsComponent } from './clinics.component'
import { ClinicResolver, TinInputGuard } from './services'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ClinicsComponent
  },
  {
    path: ':id',
    component: ClinicComponent,
    resolve: { clinic: ClinicResolver },
    canDeactivate: [TinInputGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicsRoutingModule {}
