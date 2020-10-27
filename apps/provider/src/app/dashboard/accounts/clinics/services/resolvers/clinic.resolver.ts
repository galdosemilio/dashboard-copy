import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { ContextService, NotifierService } from '@app/service';
import { OrgSingleResponse } from '@app/shared/selvera-api';
import { Organization } from 'selvera-api';

@Injectable()
export class ClinicResolver implements Resolve<OrgSingleResponse> {
  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private organization: Organization
  ) {}

  public async resolve(route: ActivatedRouteSnapshot): Promise<OrgSingleResponse> {
    try {
      const organization = await this.organization.getSingle(route.params['id']);

      this.context.clinic = organization;

      return organization;
    } catch (error) {
      this.notifier.error(error);
    }
  }
}
