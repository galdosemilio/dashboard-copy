import { AutocompleterOption } from '@coachcare/backend/shared'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { TableDataSource } from './table.datasource'

export abstract class SearchDataSource<T, R, C> extends TableDataSource<
  T,
  R,
  C
> {
  /**
   * Connects the search component to this data source. Note that
   * the stream provided will be accessed during change detection and should not directly change
   * values that are bound in template views.
   * @returns Observable that emits a new value when the data changes.
   */
  attach(): Observable<Array<AutocompleterOption>> {
    return this.connect().pipe(map(this.mapSearch.bind(this)))
  }

  attachSingle(): Observable<AutocompleterOption> {
    return this.connect().pipe(map(this.mapSingle.bind(this)))
  }

  abstract search(query: string, limit: number): void

  abstract mapSearch(result: T[]): Array<AutocompleterOption>

  abstract getSingle(id: string): Promise<T>

  abstract mapSingle(result: T): AutocompleterOption
}
