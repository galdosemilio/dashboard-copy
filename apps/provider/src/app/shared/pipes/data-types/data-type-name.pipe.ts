import { Pipe, PipeTransform } from '@angular/core'
import { selectDataTypes } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import { NamedEntity } from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Pipe({ name: 'dataTypeName' })
export class DataTypeNamePipe implements PipeTransform {
  constructor(private store: Store<AppState>) {}

  public transform(value: Partial<NamedEntity>): Observable<string> {
    return this.store
      .select(selectDataTypes)
      .pipe(
        map(
          (dataPointTypes) =>
            dataPointTypes.find(
              (assoc) => assoc.type.id === value.id.toString()
            )?.type.name ??
            value.name ??
            value.id
        )
      )
  }
}
