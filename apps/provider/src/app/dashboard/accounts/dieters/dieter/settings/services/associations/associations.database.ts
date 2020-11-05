import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  OrgAccessRequest,
  OrgAccessResponse,
  Organization
} from '@coachcare/npm-api'

@Injectable()
export class AssociationsDatabase implements CcrDatabase {
  constructor(private organization: Organization) {}

  fetch(request: OrgAccessRequest): Promise<OrgAccessResponse> {
    return this.organization.getAccessibleList(request)
  }
}
