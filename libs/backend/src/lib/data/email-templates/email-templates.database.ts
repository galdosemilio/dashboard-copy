import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  EmailTemplate,
  GetAllEmailTemplatesRequest,
  Organization,
  PagedResponse
} from '@coachcare/npm-api'
import { from, Observable } from 'rxjs'

@Injectable()
export class EmailTemplatesDatabase extends AppDatabase {
  constructor(private organization: Organization) {
    super()
  }

  fetch(
    criteria: GetAllEmailTemplatesRequest
  ): Observable<PagedResponse<EmailTemplate>> {
    return from(this.organization.getAllEmailTemplates(criteria))
  }
}
