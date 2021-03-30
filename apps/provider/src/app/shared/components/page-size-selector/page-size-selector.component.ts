import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core'
import { STORAGE_PAGE_SIZE_PATIENT_LISTING } from '@app/config'

@Component({
  selector: 'ccr-page-size-selector',
  templateUrl: './page-size-selector.component.html',
  styleUrls: ['./page-size-selector.component.scss']
})
export class CcrPageSizeSelectorComponent implements AfterViewInit {
  @ViewChild('pageSizeSelect', { static: true }) select: ElementRef

  @Input() disabled = false

  @Input() defaultPageSize = 10

  @Input() defaultPageSizeStorageKey

  @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter<number>()

  public pageSizes: number[] = [10, 25, 50]
  public selectedPageSize?: number

  public ngAfterViewInit(): void {
    let pageSize = this.defaultPageSize

    if (this.defaultPageSizeStorageKey) {
      const pageSizeString = window.localStorage.getItem(
        this.defaultPageSizeStorageKey
      )

      if (pageSizeString) {
        pageSize = Number(pageSizeString)
      }
    }

    this.select.nativeElement.value = pageSize
    this.onSelect({ target: { value: pageSize } })
  }

  public onSelect($event): void {
    this.selectedPageSize = Number($event.target.value ?? 10)
    this.onPageSizeChange.emit(this.selectedPageSize)

    if (this.defaultPageSizeStorageKey) {
      window.localStorage.setItem(
        this.defaultPageSizeStorageKey,
        this.selectedPageSize.toString()
      )
    }
  }
}
