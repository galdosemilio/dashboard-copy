import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router'

import {
  OrganizationPreference,
  OrganizationPreferenceSingle
} from '@coachcare/sdk'
import { OrganizationRoutes } from './organization.routes'

@Injectable()
export class OrganizationPreferenceResolver
  implements Resolve<OrganizationPreferenceSingle | null> {
  constructor(
    private router: Router,
    private organizationPreference: OrganizationPreference,
    private routes: OrganizationRoutes
  ) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Promise<OrganizationPreferenceSingle | null> {
    const id = route.paramMap.get('id') as string

    return this.organizationPreference
      .getSingle({ id, mala: true })
      .then((preferences) => preferences)
      .catch(() => {
        // TODO log error
        this.router.navigate([this.routes.list()])
        return null
      })
  }
}
