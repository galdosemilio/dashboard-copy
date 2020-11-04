import { TableDataSource } from '@coachcare/backend/model'
import {
  EmailTemplate,
  GetAllEmailTemplatesRequest,
  PagedResponse
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { EmailTemplatesDatabase } from './email-templates.database'

export class EmailTemplatesDataSource extends TableDataSource<
  EmailTemplate,
  PagedResponse<EmailTemplate>,
  GetAllEmailTemplatesRequest
> {
  constructor(protected database: EmailTemplatesDatabase) {
    super()
  }

  defaultFetch(): PagedResponse<EmailTemplate> {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: GetAllEmailTemplatesRequest
  ): Observable<PagedResponse<EmailTemplate>> {
    return this.database.fetch(criteria)
  }

  mapResult(result: PagedResponse<EmailTemplate>): EmailTemplate[] {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset !== undefined
      ? this.criteria.offset + result.data.length
      : 0
    return result.data
  }
}
