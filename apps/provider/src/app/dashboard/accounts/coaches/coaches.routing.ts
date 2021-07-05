import { Routes } from '@angular/router'
import { CoachComponent, CoachesComponent, CoachResolver } from './'

export const CoachesRoutes: Routes = [
  { path: '', pathMatch: 'full', component: CoachesComponent },
  {
    path: ':id',
    component: CoachComponent,
    resolve: {
      account: CoachResolver
    }
  }
]
