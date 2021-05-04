import { Injectable } from '@angular/core'
import { AccountTypeId } from '@coachcare/sdk'
import { CcrRol } from '@coachcare/backend/shared'
import { ContextService } from '@coachcare/common/services'

@Injectable()
export class AccountRoutes {
  /**
   * Constants
   */
  static ADMIN = 'accounts'
  static PROVIDER = 'accounts'

  // FIXME fetch current site from ngrx
  site = 'admin'

  /**
   * Account route handler
   */
  constructor(private context: ContextService) {}

  list(type: AccountTypeId, force?: CcrRol) {
    const site = force || this.context.site || 'admin'

    switch (site) {
      case 'admin':
        return `/${site}/${AccountRoutes.ADMIN}/${this.getSection(type)}`
      case 'provider':
        return `/${site}/${AccountRoutes.PROVIDER}`
      default:
        console.error('List route not implemented', site)
        return ``
    }
  }

  single(type: AccountTypeId, id: string) {
    const site = this.context.site || 'admin'

    switch (site) {
      case 'admin':
        return `/${site}/${AccountRoutes.ADMIN}/${this.getSection(type)}/${id}`
      default:
        console.error('Single route not implemented', site)
        return ``
    }
  }

  edit(type: AccountTypeId, id: string) {
    return `/${this.site}/${AccountRoutes.ADMIN}/${this.getSection(
      type
    )}/${id}/data/edit`
  }

  private getSection(type: AccountTypeId) {
    switch (type) {
      case AccountTypeId.Admin:
        return 'admins'
      case AccountTypeId.Provider:
        return 'coaches'
      default:
        return 'patients'
    }
  }
}
