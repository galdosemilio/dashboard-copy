import { PreloadAllModules, RouterModule, Routes } from '@angular/router'

// LayoutModule routes are also loaded
const routes: Routes = [{ path: '**', redirectTo: '/' }]

export const AppRoutes = RouterModule.forRoot(routes, {
  preloadingStrategy: PreloadAllModules,
  paramsInheritanceStrategy: 'always',
  relativeLinkResolution: 'legacy'
})
