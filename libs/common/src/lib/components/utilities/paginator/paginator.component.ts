import { Component, ElementRef, Input, ViewChild } from '@angular/core'
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
  @Input() showOffsetSelector = true

  @Input() set length(value: number) {
    this._dataLength = value
    this.length$.next(value)
  }

  get length() {
    return this._dataLength
  }

  private _dataLength: number
  private length$ = new Subject<number>()

  get pages() {
    return this.getNumberOfPages()
  }

  ngOnInit() {
    this.page.pipe(untilDestroyed(this)).subscribe((e) => {
      this.select.nativeElement.value = e.pageIndex
    })

    this.length$.pipe(untilDestroyed(this), debounceTime(500)).subscribe(() => {
      this.select.nativeElement.value = this.pageIndex
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
