import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { ContextService, NotifierService } from '@app/service'
import { OrganizationProvider, OrgSingleResponse } from '@coachcare/sdk'

@Injectable()
export class ClinicResolver implements Resolve<OrgSingleResponse> {
  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private organization: OrganizationProvider
  ) {}

  public async resolve(
    route: ActivatedRouteSnapshot
  ): Promise<OrgSingleResponse> {
    try {
      const organization = await this.organization.getSingle(route.params['id'])

      this.context.clinic = organization

      return organization
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
