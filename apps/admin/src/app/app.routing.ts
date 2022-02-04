import { Routes } from '@angular/router'
import { SessionGuard } from '@board/pages/pages.providers'

export const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AppAdminModule),
    canLoad: [SessionGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.AppPagesModule)
  }
]
