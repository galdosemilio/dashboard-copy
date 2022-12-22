import { Injectable } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import {
  FetchAllIdentifiersRequest,
  FetchAllIdentifiersResponse,
  GetListAccountRequest,
  Identifier
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { ExternalIdentifiersDatabase } from './external-identifiers.database'

@Injectable()
export class ExternalIdentifiersDataSource extends TableDataSource<
  Identifier,
  FetchAllIdentifiersResponse,
  GetListAccountRequest
> {
  constructor(protected database: ExternalIdentifiersDatabase) {
    super()
  }

  defaultFetch(): FetchAllIdentifiersResponse {
    return {
      data: []
    }
  }

  fetch(
    criteria: FetchAllIdentifiersRequest
  ): Observable<FetchAllIdentifiersResponse> {
    return from(this.database.getAll(criteria))
  }

  mapResult(result: FetchAllIdentifiersResponse): Array<Identifier> {
    this.total = result.data.length
    this.totalCount = result.data.length
    return result.data
  }
}
