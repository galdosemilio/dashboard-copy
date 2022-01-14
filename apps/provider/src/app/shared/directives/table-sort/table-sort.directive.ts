import {
  AfterContentInit,
  ContentChildren,
  Directive,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewContainerRef
} from '@angular/core'
import {
  CcrSort,
  CcrTableSortHeaderComponent
} from '@app/shared/components/table-sort-header/table-sort-header.component'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Directive({
  selector: '[ccrTableSort]'
})
export class CcrTableSortDirective implements AfterContentInit {
  @Input() singleSelection = true

  @Output() sortChange: EventEmitter<CcrSort[]> = new EventEmitter<CcrSort[]>()

  @ContentChildren(CcrTableSortHeaderComponent, { descendants: true })
  sortHeaders: QueryList<CcrTableSortHeaderComponent>

  public active?: string
  public direction?: string
  public sort$: Subject<CcrSort> = new Subject<CcrSort>()

  private allSorts: CcrSort[] = []

  constructor(public viewContainer: ViewContainerRef) {
    this.onSortChange = this.onSortChange.bind(this)
    this.sort = this.sort.bind(this)
    this.sort$
      .pipe(untilDestroyed(this), debounceTime(200))
      .subscribe(this.sort)
  }

  public ngAfterContentInit(): void {
    this.subscribeToEventEmitters()
  }

  public sort(sort: CcrSort): void {
    if (sort.dir === this.direction && sort.property === this.active) {
      return
    }

    const header =
      this.sortHeaders &&
      this.sortHeaders.find((entry) => entry.property === sort.property)

    if (!header) {
      return
    }

    header.direction = sort.dir
    this.onSortChange(sort)
  }

  private onSortChange(sort: CcrSort): void {
    const foundSort = this.allSorts.find(
      (currentSort) => currentSort.property === sort.property
    )

    if (!this.singleSelection) {
      if (foundSort) {
        if (sort.dir) {
          foundSort.dir = sort.dir
        } else {
          this.allSorts = this.allSorts.filter(
            (currentSort) => currentSort.property !== sort.property
          )
        }
      } else {
        this.allSorts = [...this.allSorts, sort]
      }
    } else {
      this.sortHeaders
        .filter((sortHeader) => sortHeader.property !== sort.property)
        .forEach((sortHeader) => {
          sortHeader.direction = null
        })
      this.allSorts = [sort]
    }

    this.direction = sort.dir
    this.active = sort.property
    this.sortChange.emit(this.allSorts.slice())
  }

  private subscribeToEventEmitters(): void {
    this.sortHeaders.forEach((sortHeader) => {
      sortHeader.onSortChange
        .pipe(untilDestroyed(this), debounceTime(200))
        .subscribe(this.onSortChange)
    })
  }
}
