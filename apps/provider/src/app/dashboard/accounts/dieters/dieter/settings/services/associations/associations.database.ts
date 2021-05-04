import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  OrgAccessRequest,
  OrgAccessResponse,
  OrganizationProvider
} from '@coachcare/sdk'

@Injectable()
export class AssociationsDatabase implements CcrDatabase {
  constructor(private organization: OrganizationProvider) {}

  fetch(request: OrgAccessRequest): Promise<OrgAccessResponse> {
    return this.organization.getAccessibleList(request)
  }
}
