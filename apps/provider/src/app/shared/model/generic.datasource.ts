import { CollectionViewer } from '@angular/cdk/collections'
import { DataSource } from '@angular/cdk/table'
import { MatPaginator, MatSort } from '@coachcare/material'
import { isArray, isEmpty, isFunction } from 'lodash'

import {
  BehaviorSubject,
  combineLatest,
  from,
  merge,
  Observable,
  of,
  Subject,
  timer
} from 'rxjs'
import {
  catchError,
  filter,
  map,
  switchMap,
  take,
  takeUntil,
  tap
} from 'rxjs/operators'

import { _ } from '@app/shared/utils'
import { CcrDatabase } from './generic.database'
import { CcrTableSortDirective } from '../directives'

export interface DataCriteria {
  doReload?: boolean
  [arg: string]: any
}

export abstract class CcrDataSource<
  T,
  R,
  C extends DataCriteria
> extends DataSource<T> {
  /**
   * Required services to be injected.
   */
  protected abstract database: CcrDatabase

  /**
   * Latest fetched data.
   */
  protected _data: R

  /**
   * Latest mapped data.
   */
  protected _result: Array<T>

  /**
   * Flags to control outside behavior like css classes and components.
   * Updated by mapResult to hide spinner and empty message.
   */
  isLoaded = false
  isLoading = true
  isEmpty = true
  startWithNull = true

  /**
   * Error messages handling.
   */
  showErrors = true
  showEmpty: boolean | string | (() => string) = true
  protected _errors: Array<string> = []
  addError(error: string) {
    this._errors.push(error)
  }
  getErrors() {
    return this._errors
  }
  hasErrors(force = false): boolean {
    return (this.showErrors || force) && !!this._errors.length
  }
  // overridable error handler
  errorHandler = function (err) {
    this.addError(err)
  }

  /**
   * Loading messages handling.
   */
  loadingMsg: string
  waitMsg = _('NOTIFY.SOURCE.DEFAULT_WAIT')
  delayMsg = _('NOTIFY.SOURCE.DEFAULT_DELAY')
  timeoutMsg = _('NOTIFY.SOURCE.DEFAULT_TIMEOUT')

  /**
   * Control members for the datasource processing.
   */
  protected criteria: C
  protected defaults: Partial<C> = {}
  protected overrides: any = {}
  // streams to listen
  protected required: Array<Observable<any>> = []
  protected optional: Array<Observable<any>> = []
  protected getters: Array<() => Partial<C>> = []
  // maps a name to its stream and getter
  protected regmap = new Map<string, [boolean, number, number]>()

  get args() {
    return this.criteria
  }

  get result() {
    return this._result
  }

  /**
   * Stream only used to trigger a refresh on the data.
   * Can receive some Criteria overrides for a temporary update.
   * Must be used outside the datasource to prevent infinite loops.
   */
  trigger$ = new BehaviorSubject<any>('trigger.init')

  /**
   * Output Emitter to refresh the UI.
   */
  change$ = new Subject<any>()

  /**
   * Disconnect observable.
   */
  private disconnect$ = new Subject<void>()

  /**
   * DataSource.
   */
  constructor() {
    super()
    this.criteria = {} as C

    // listen the internal trigger
    this.addOptional(this.trigger$, () => ({}))
  }

  addDefault(add: Partial<C>) {
    Object.assign(this.defaults, add)
  }

  addRequired(stream: Observable<any>, getter: () => Partial<C>) {
    this.required.push(stream)
    this.getters.push(getter)
  }

  addOptional(stream: Observable<any>, getter: () => Partial<C>) {
    this.optional.push(stream)
    this.getters.push(getter)
  }

  register(
    name: string,
    isRequired: boolean,
    stream: Observable<any>,
    getter: () => Partial<C>
  ) {
    let req, str, gtr
    if (this.regmap.has(name)) {
      // stream is already mapped
      ;[req, str, gtr] = this.regmap.get(name)
      if (req) {
        this.required[str] = stream
      } else {
        this.optional[str] = stream
      }
      this.getters[gtr] = getter
    } else {
      // map the stream positions
      str = isRequired ? this.required.push(stream) : this.optional.push(stream)
      gtr = this.getters.push(getter)
      this.regmap.set(name, [isRequired, str - 1, gtr - 1])
    }
  }

  unregister(name: string) {
    if (this.regmap.has(name)) {
      // delete the mapped stream and getter
      const [req, str, gtr] = this.regmap.get(name)
      if (req) {
        this.required.splice(str, 1)
      } else {
        this.optional.splice(str, 1)
      }
      this.getters.splice(gtr, 1)
      this.regmap.delete(name)
    }
  }

  /**
   * Common Utilities
   * These should be used OnInit and OnDestroy
   */
  setPaginator(paginator: MatPaginator, getter: () => Partial<C>) {
    // listen the paginator events
    if (paginator) {
      this.register('paginator', false, paginator.page.asObservable(), getter)
    }
  }

  unsetPaginator() {
    this.unregister('paginator')
  }

  setSorter(sorter: MatSort | CcrTableSortDirective, getter: () => Partial<C>) {
    // listen the paginator events
    if (sorter) {
      this.register('sorter', false, sorter.sortChange.asObservable(), getter)
    }
  }

  unsetSorter() {
    this.unregister('sorter')
  }

  /**
   * Data processing that can be completely customized.
   */
  abstract defaultFetch(): R

  abstract fetch(criteria: Partial<C>): Observable<R>

  abstract mapResult(result: R): Array<T> | Promise<Array<T>>

  /**
   * Procedural Methods
   */
  refresh(overrides: Partial<C> = {}) {
    if (!isEmpty(overrides)) {
      this.overrides = overrides
    }
    this.trigger$.next('trigger.refresh')
  }

  reload() {
    if (this.isLoaded) {
      this.overrides = { doReload: true }
    }
    this.trigger$.next('trigger.reload')
  }

  postResult(result: Array<T>): Array<T> {
    return result
  }

  preQuery(): void {
    this.isLoading = true
    this.loadingMsg = undefined
    this._data = undefined
    this._errors.length = 0
  }

  query(overrides: Partial<C> = {}): Observable<R> {
    if (!isEmpty(overrides)) {
      this.overrides = overrides
    }

    const values = this.getters.map((f) => f())

    // add defaults at the beggining
    values.unshift(this.defaults)

    if (this.overrides) {
      // add overrides at the end
      values.push(this.overrides)
      this.overrides = {}
    }

    // merge all the getters outputs
    this.criteria = (values.length > 1
      ? values.reduce((a, b) => Object.assign({}, a, b))
      : values[0]) as C

    // TODO implement Observable of criteria, and trigger on distinct
    return this.criteria.doReload && this.isLoaded
      ? of(this._data)
      : this.fetch(this.criteria)
  }

  /**
   * All the required streams must emit one value to return an initial result.
   * The optional streams are supposed to emit values later on.
   */
  connect(collectionViewer?: CollectionViewer): Observable<Array<T>> {
    const stream = combineLatest([
      this.required.length ? combineLatest(this.required) : of(['source.init']),
      merge(...this.optional)
    ])

    return stream.pipe(
      takeUntil(this.disconnect$),
      switchMap(() => {
        this.preQuery()
        this.change$.next()

        const query = this.query()

        // disposable stream
        return merge(
          query,
          // delay/timeout timer
          timer(5000, 10000).pipe(
            takeUntil(query),
            take(3) // 5s, 15s, 25s
          )
        ).pipe(
          take(3),
          // delay check
          tap((pos) => {
            if (typeof pos === 'number') {
              if (pos < 2) {
                this.loadingMsg = !pos ? this.waitMsg : this.delayMsg
              } else {
                this.addError(this.timeoutMsg)
                this.isLoading = false
              }
              this.change$.next()
            }
          }),
          // discard timer result
          filter((result) => typeof result !== 'number'),
          catchError((err) => {
            // isolate error
            this.errorHandler(err)
            return of(this.defaultFetch())
          })
        ) as Observable<R>
      }),
      switchMap((fetched: R) => {
        this._data = fetched
        this.isLoaded = !this.hasErrors() ? true : false

        if (!this.hasErrors()) {
          const res = this.mapResult(fetched)
          return isArray(res) ? of(res) : from(res)
        }
        return of([])
      }),
      map((result: Array<T>) => {
        this._result = this.postResult(result)
        this.isEmpty = !this._result || !this._result.length
        if (!this.hasErrors() && this.isEmpty && this.showEmpty) {
          const error =
            typeof this.showEmpty === 'boolean'
              ? _('NOTIFY.SOURCE.NO_DATA_AVAILABLE')
              : isFunction(this.showEmpty)
              ? this.showEmpty()
              : this.showEmpty
          this.addError(error)
        }
        this.isLoading = false
        this.change$.next()
        return this._result
      })
    )
  }

  disconnect(collectionViewer?: CollectionViewer) {
    this.change$.complete()
    this.disconnect$.next()
    this.disconnect$.complete()
    this.trigger$.complete()
  }
}
