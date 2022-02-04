import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CoachComponent, CoachesComponent, CoachResolver } from './'

const routes: Routes = [
  { path: '', pathMatch: 'full', component: CoachesComponent },
  {
    path: ':id',
    component: CoachComponent,
    resolve: {
      account: CoachResolver
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoachesRoutingModule {}
