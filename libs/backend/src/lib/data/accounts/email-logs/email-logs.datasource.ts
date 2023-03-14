import { Injectable } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import {
  EmailMessage,
  GetAccountEmailMessagesRequest,
  GetAccountEmailMessagesResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { EmailLogsDatabase } from './email-logs.database'

@Injectable()
export class EmailLogsDataSource extends TableDataSource<
  EmailMessage,
  GetAccountEmailMessagesResponse,
  GetAccountEmailMessagesRequest
> {
  constructor(protected database: EmailLogsDatabase) {
    super()
  }

  defaultFetch(): GetAccountEmailMessagesResponse {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(
    criteria: GetAccountEmailMessagesRequest
  ): Observable<GetAccountEmailMessagesResponse> {
    return from(this.database.getAll(criteria))
  }

  mapResult(result: GetAccountEmailMessagesResponse): Array<EmailMessage> {
    this.total = result.data.length
    this.totalCount = result.data.length
    return result.data
  }
}
