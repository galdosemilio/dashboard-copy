import { Subject } from 'rxjs'
import { TableDataSource } from './table.datasource'

// TODO move to a mixin
export abstract class StatsDataSource<T, R, C, S> extends TableDataSource<
  T,
  R,
  C
> {
  stat$ = new Subject<S>()
}
