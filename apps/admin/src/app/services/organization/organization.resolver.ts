import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'

import { OrganizationProvider, OrganizationSingle } from '@coachcare/sdk'
import { OrganizationRoutes } from './organization.routes'

@Injectable()
export class OrganizationResolver
  implements Resolve<OrganizationSingle | null> {
  constructor(
    private router: Router,
    private organization: OrganizationProvider,
    private routes: OrganizationRoutes
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<OrganizationSingle | null> {
    const id = route.paramMap.get('id') as string

    return this.organization
      .getSingle(id)
      .then((org) => org)
      .catch(() => {
        // TODO log error
        void this.router.navigate([this.routes.list()])
        return null
      })
  }
}
