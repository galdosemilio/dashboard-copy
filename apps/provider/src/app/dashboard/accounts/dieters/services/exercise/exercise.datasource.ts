import { MatPaginator } from '@coachcare/material'
import { NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared'
import { GetAllExerciseRequest, GetAllExerciseResponse } from '@coachcare/sdk'
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
        offset: this.pageIndex * this.pageSize,
        limit: this.pageSize
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
    this.getTotal(result)
    return result.data.map((r) => new ExerciseData(r))
  }
}
