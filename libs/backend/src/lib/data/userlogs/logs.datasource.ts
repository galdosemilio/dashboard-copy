import { Injectable } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import {
  FetchUserLogRequest,
  FetchUserLogResponse,
  UserLogEntry
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { LogsDatabase } from './logs.database'

@Injectable()
export class LogsDataSource extends TableDataSource<
  UserLogEntry,
  FetchUserLogResponse,
  FetchUserLogRequest
> {
  constructor(protected database: LogsDatabase) {
    super()
  }

  defaultFetch(): FetchUserLogResponse {
    return {
      data: [],
      pagination: {}
    }
  }

  fetch(criteria: FetchUserLogRequest): Observable<FetchUserLogResponse> {
    return this.database.fetchUserLog(criteria)
  }

  mapResult(result: FetchUserLogResponse): any {
    // pagination handling
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset != undefined
      ? this.criteria.offset + result.data.length
      : 0

    return result.data
  }
}
