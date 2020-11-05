import { MatPaginator } from '@coachcare/common/material'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import {
  GetAllExerciseRequest,
  GetAllExerciseResponse
} from '@coachcare/npm-api'
import { Observable } from 'rxjs'
import { ExerciseData } from './exercise.data'
import { ExerciseDatabase } from './exercise.database'

export class ExerciseDataSource extends TableDataSource<
  ExerciseData,
  GetAllExerciseResponse,
  GetAllExerciseRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: ExerciseDatabase,
    protected paginator?: MatPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }))
    }
  }

  defaultFetch(): GetAllExerciseResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: GetAllExerciseRequest): Observable<GetAllExerciseResponse> {
    return this.database.fetchAll(criteria)
  }

  mapResult(result: GetAllExerciseResponse): ExerciseData[] {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length
    return result.data.map((r) => new ExerciseData(r))
  }
}
