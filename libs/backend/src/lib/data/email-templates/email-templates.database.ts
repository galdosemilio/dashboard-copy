import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  EmailTemplate,
  GetAllEmailTemplatesRequest,
  OrganizationProvider,
  PagedResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class EmailTemplatesDatabase extends AppDatabase {
  constructor(private organization: OrganizationProvider) {
    super()
  }

  fetch(
    criteria: GetAllEmailTemplatesRequest
  ): Observable<PagedResponse<EmailTemplate>> {
    return from(this.organization.getAllEmailTemplates(criteria))
  }
}
