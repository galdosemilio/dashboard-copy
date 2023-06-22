import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import { MatPaginator } from '@coachcare/material'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, Subject, Subscription } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'ccr-paginator',
  templateUrl: './paginator.component.html'
})
export class CcrPaginatorComponent extends MatPaginator {
  @ViewChild('pageOffsetSelect', { static: true }) select: ElementRef
  @Input() inverse = false
  @Input() disabled = false
  @Input() showOffsetSelector = false

  @Input() set totalCount(value: number) {
    this.totalCount$.next(value)
  }

  @Input() set source(value: TableDataSource<unknown, unknown, unknown>) {
    this._source = value
    this.source$.next(value)
  }

  get source() {
    return this._source
  }

  private totalCount$ = new Subject<number>()
  private source$ = new Subject<TableDataSource<unknown, unknown, unknown>>()
  private _totalCount = 0
  private _source: TableDataSource<unknown, unknown, unknown>
  private sourceChangeSub: Subscription
  private defaultPage$ = new Subject<number>()

  get totalCountPages() {
    const pages =
      this.pageSize && this._totalCount
        ? Math.ceil(this._totalCount / this.pageSize)
        : 0

    return pages
  }

  ngOnInit() {
    this.source$.pipe(untilDestroyed(this), debounceTime(200)).subscribe(() => {
      this.onSubscribeSource()
    })

    this.onSubscribeSource()

    this.page.pipe(untilDestroyed(this)).subscribe((e) => {
      this.select.nativeElement.value = e.pageIndex

      if (this.source) {
        this.source.pageIndex = e.pageIndex
      }
    })

    this.defaultPage$
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe((page) => {
        this.select.nativeElement.value = page
      })

    this.totalCount$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((value) => {
        this.defaultPage$.next(this.pageIndex)
        this._totalCount = value ?? 0
        this.showOffsetSelector = this._totalCount > 0
      })
  }

  private onSubscribeSource() {
    if (this.sourceChangeSub) {
      this.sourceChangeSub.unsubscribe()
    }

    if (!this.source) {
      return
    }

    this.totalCount = this.source.totalCount
    this.pageIndex = this.source.pageIndex ?? 0
    this.pageSize = this.source.pageSize ?? 10
    this.length = this.source.total

    this.sourceChangeSub = this.source.change$
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        this.length = this.source.total ?? 0
        this.totalCount = this.source.totalCount ?? 0
      })
  }

  public onSelect($event): void {
    const pageNumber = Number($event.target.value)
    this.pageIndex = pageNumber
    this.page.next({
      pageIndex: pageNumber,
      pageSize: this.pageSize,
      length: this.length
    })
  }
}
