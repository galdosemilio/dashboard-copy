import { Injectable } from '@angular/core'
import { AppDatabase } from '@coachcare/backend/model'
import {
  AccountIdentifier,
  AddIdentifierRequest,
  AddIdentifierResponse,
  DeleteIdentifierRequest,
  FetchAllIdentifiersRequest,
  FetchAllIdentifiersResponse,
  FetchIdentifierRequest,
  Identifier,
  UpdateIdentifierRequest
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class ExternalIdentifiersDatabase extends AppDatabase {
  constructor(private accountIdentifier: AccountIdentifier) {
    super()
  }

  getAll(
    request: FetchAllIdentifiersRequest
  ): Observable<FetchAllIdentifiersResponse> {
    return from(this.accountIdentifier.fetchAll(request))
  }

  getSingle(request: FetchIdentifierRequest): Promise<Identifier> {
    return this.accountIdentifier.fetch(request)
  }

  create(request: AddIdentifierRequest): Promise<AddIdentifierResponse> {
    return this.accountIdentifier.add(request)
  }

  update(request: UpdateIdentifierRequest): Promise<void> {
    return this.accountIdentifier.update(request)
  }

  delete(request: DeleteIdentifierRequest): Promise<void> {
    return this.accountIdentifier.delete(request)
  }
}
