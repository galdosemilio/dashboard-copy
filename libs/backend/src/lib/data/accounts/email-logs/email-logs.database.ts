import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  ClearEmailDeliverabilityIssuesRequest,
  EmailProvider,
  GetAccountEmailIssuesRequest,
  GetAccountEmailIssuesResponse,
  GetAccountEmailMessagesRequest,
  GetAccountEmailMessagesResponse,
  GetSendGridAccountListResponse
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class EmailLogsDatabase extends AppDatabase {
  constructor(private emailProvider: EmailProvider) {
    super()
  }

  getAll(
    request: GetAccountEmailMessagesRequest
  ): Observable<GetAccountEmailMessagesResponse> {
    return from(this.emailProvider.getAccountEmailMessages(request))
  }

  getSendgridAccounts(): Promise<GetSendGridAccountListResponse> {
    return this.emailProvider.getSendgridAccounts()
  }

  getEmailDeliverabilityIssues(
    request: GetAccountEmailIssuesRequest
  ): Promise<GetAccountEmailIssuesResponse> {
    return this.emailProvider.getAccountEmailDeliverabilityIssues(request)
  }

  clearEmailDeliverabilityIssues(
    request: ClearEmailDeliverabilityIssuesRequest
  ) {
    return this.emailProvider.clearEmailDeliverabilityIssues(request)
  }
}
