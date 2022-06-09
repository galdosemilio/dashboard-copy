import { RouterModule, Routes } from '@angular/router'

// LayoutModule routes are also loaded
const routes: Routes = [{ path: '**', redirectTo: '/' }]

export const AppRoutes = RouterModule.forRoot(routes, {
  paramsInheritanceStrategy: 'always',
  relativeLinkResolution: 'legacy'
})
