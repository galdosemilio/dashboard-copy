import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ListingPaginationGuard } from '@app/service'

const routes: Routes = [
  {
    path: 'patients',
    loadChildren: () =>
      import('./dieters/dieters.module').then((m) => m.DietersModule),
    canDeactivate: [ListingPaginationGuard]
  },
  {
    path: 'coaches',
    loadChildren: () =>
      import('./coaches/coaches.module').then((m) => m.CoachesModule),
    canDeactivate: [ListingPaginationGuard]
  },
  {
    path: 'clinics',
    loadChildren: () =>
      import('./clinics/clinics.module').then((m) => m.ClinicsModule)
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
