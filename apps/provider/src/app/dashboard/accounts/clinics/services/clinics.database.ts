import { Injectable } from '@angular/core'
import { from, Observable } from 'rxjs'
import { OrgAccessResponse, OrganizationProvider } from '@coachcare/npm-api'

import { CcrDatabase } from '@app/shared'
import { ClinicCriteria } from './clinics.criteria'

@Injectable()
export class ClinicsDatabase extends CcrDatabase {
  constructor(private organization: OrganizationProvider) {
    super()
  }

  fetch(args: ClinicCriteria): Observable<OrgAccessResponse> {
    return from(
      this.organization.getAccessibleList({
        query: args.query ? args.query.trim() || undefined : undefined,
        account: args.account,
        strict: args.strict,
        status: 'active',
        permissions: {
          admin: args.admin || undefined,
          viewAll: args.viewAll || undefined,
          allowClientPhi: args.allowClientPhi || undefined
        },
        limit: args.limit,
        offset: args.offset,
        sort: args.sort
      })
    )
  }
}
