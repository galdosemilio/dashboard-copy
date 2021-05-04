import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import { GetAllExerciseRequest, GetAllExerciseResponse } from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { Exercise } from '@coachcare/sdk'

@Injectable()
export class ExerciseDatabase extends CcrDatabase {
  constructor(private exercise: Exercise) {
    super()
  }

  fetchAll(args: GetAllExerciseRequest): Observable<GetAllExerciseResponse> {
    return from(this.exercise.getAll(args))
  }
}
