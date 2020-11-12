import { Injectable } from '@angular/core'
import { CcrRol } from '@coachcare/backend/shared'
import { ContextService } from '@coachcare/common/services'

@Injectable()
export class OrganizationRoutes {
  /**
   * Constants
   */
  static ADMIN = 'organizations'
  static PROVIDER = 'clinics'

  // FIXME fetch current site from ngrx
  site = 'admin'

  /**
   * Organization route handler
   */
  constructor(private context: ContextService) {}

  list(force?: CcrRol) {
    const site = force || this.context.site || 'admin'

    switch (site) {
      case 'admin':
        return `/${site}/${OrganizationRoutes.ADMIN}`
      case 'provider':
        return `/${site}/${OrganizationRoutes.PROVIDER}`
      default:
        console.error('List route not implemented', site)
        return ``
    }
  }

  single(id: string) {
    const site = this.context.site || 'admin'

    switch (site) {
      case 'admin':
        return `/${site}/${OrganizationRoutes.ADMIN}/${id}`
      default:
        console.error('Single route not implemented', site)
        return ``
    }
  }

  edit(id: string) {
    return `/${this.site}/${OrganizationRoutes.ADMIN}/${id}/data/edit`
  }
}
