import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { ContextService } from '@app/service'
import {
  PackageDatabase,
  PackageDatasource
} from '@app/shared/components/package-table/services'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Package, PackageSelectEvents } from './models'

@UntilDestroy()
@Component({
  selector: 'app-content-package-table',
  templateUrl: './package-table.component.html'
})
export class PackageTableComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  @Input()
  set array(a: Package[]) {
    this._array = a
    if (!this.useSource) {
      this.shiftShownElements()
      this.packages.emit(this.array)
    } else {
      this.syncShownElements()
    }
  }

  get array(): Package[] {
    return this._array.slice()
  }
  @Input()
  events?: PackageSelectEvents
  @Input()
  source: PackageDatasource
  @Input()
  useSource = true

  @Output()
  packages: EventEmitter<Package[]> = new EventEmitter<Package[]>()

  public columns = ['check', 'title', 'clinic']
  public shownElements: Package[] = []
  public pageIndex = 0
  public pageSize = 10

  private _array: Package[] = []

  constructor(
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private database: PackageDatabase
  ) {}

  ngOnDestroy(): void {
    if (this.source) {
      this.source.unsetPaginator()
    }
  }

  ngOnInit(): void {
    if (this.useSource) {
      if (!this.source) {
        this.source = new PackageDatasource(this.context, this.database)
      }

      this.source.setPaginator(this.paginator, () => ({
        limit: this.paginator.pageSize || this.source.pageSize,
        offset:
          this.paginator.pageIndex *
          (this.paginator.pageSize || this.source.pageSize)
      }))
      this.source
        .connect()
        .pipe(untilDestroyed(this))
        .subscribe((packages: Package[]) => {
          this.shownElements = packages
          this.syncShownElements()
        })
    } else if (this.array) {
      this.shiftShownElements()
    }

    this.subscribeToEvents()
  }

  onCheckClick(pkg: Package): void {
    const index: number = this.shownElements.findIndex(
      (p: Package) => p.id === pkg.id
    )

    if (!this.shownElements[index].checked) {
      this.events.packageSelected.emit(this.shownElements[index])
    } else {
      this.events.packageDeselected.emit(this.shownElements[index])
    }
  }

  onPageChange($event?: any): void {
    this.pageIndex =
      $event.pageIndex !== undefined ? $event.pageIndex : this.pageIndex

    if (!this.useSource) {
      this.shiftShownElements()
    }
  }

  private shiftShownElements(
    start: number = this.pageIndex * this.pageSize,
    end: number = (this.pageIndex + 1) * this.pageSize
  ): void {
    const resultArr: Package[] = []
    for (let i = start; i < end && i < this.array.length; ++i) {
      resultArr.push(this.array[i])
    }
    this.shownElements = resultArr
    this.cdr.detectChanges()
  }

  private subscribeToEvents(): void {
    this.events.packageSelected
      .pipe(untilDestroyed(this))
      .subscribe((pkg: Package) => {
        if (!this.useSource) {
          const newArray: Package[] = this.array
          newArray.push({ ...pkg, checked: true })
          this.array = newArray
        }
        const index: number = this.shownElements.findIndex(
          (p: Package) => p.id === pkg.id
        )
        if (index > -1) {
          this.shownElements[index].checked = true
          this.shownElements = this.shownElements.slice()
        }
      })

    this.events.packageDeselected
      .pipe(untilDestroyed(this))
      .subscribe((pkg: Package) => {
        if (!this.useSource) {
          const newArray: Package[] = this.array.filter(
            (p: Package) => p.id !== pkg.id
          )
          this.array = newArray
          this.pageIndex = 0
          this.onPageChange({})
        }
        const index: number = this.shownElements.findIndex(
          (p: Package) => p.id === pkg.id
        )
        if (index > -1) {
          this.shownElements[index].checked = false
        }
      })
  }

  private syncShownElements(): void {
    if (this.array && this.array.length) {
      this.shownElements.forEach((sE: Package) => {
        if (this.array.find((el: Package) => el.id === sE.id)) {
          sE.checked = true
        }
      })
    }
  }
}
