import { Component, ElementRef, Input, ViewChild } from '@angular/core'
import { TableDataSource } from '@coachcare/backend/model'
import { MatPaginator } from '@coachcare/material'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { debounceTime, Subject } from 'rxjs'

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

  @Input() source: TableDataSource<unknown, unknown, unknown>

  private totalCount$ = new Subject<number>()
  private _totalCount = 0

  get totalCountPages() {
    return Math.ceil(this._totalCount / this.pageSize)
  }

  ngOnInit() {
    if (this.source) {
      this.totalCount = this.source.totalCount
      this.pageIndex = this.source.pageIndex ?? 0
      this.pageSize = this.source.pageSize ?? 10
      this.length = this.source.total

      this.source.change$.pipe(untilDestroyed(this)).subscribe(() => {
        this.length = this.source.total ?? 0
        this.totalCount = this.source.totalCount ?? 0
      })
    }

    this.page.pipe(untilDestroyed(this)).subscribe((e) => {
      this.select.nativeElement.value = e.pageIndex

      if (this.source) {
        this.source.pageIndex = e.pageIndex
      }
    })

    this.totalCount$
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((value) => {
        this.select.nativeElement.value = this.pageIndex
        this._totalCount = value ?? 0
        this.showOffsetSelector = this._totalCount > 0
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
