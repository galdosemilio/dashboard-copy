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

  @Output() onPageSizeChange: EventEmitter<number> = new EventEmitter<number>()

  public pageSizes: number[] = [10, 25, 50]
  public selectedPageSize?: number

  public ngAfterViewInit(): void {
    const pageSize = window.localStorage.getItem(
      STORAGE_PAGE_SIZE_PATIENT_LISTING
    )

    if (!pageSize) {
      return
    }

    const pageSizeAsNumber = Number(pageSize)

    this.select.nativeElement.value = pageSizeAsNumber
    this.onSelect({ target: { value: pageSizeAsNumber } })
  }

  public onSelect($event): void {
    this.selectedPageSize = Number($event.target.value ?? 10)
    this.onPageSizeChange.emit(this.selectedPageSize)
    window.localStorage.setItem(
      STORAGE_PAGE_SIZE_PATIENT_LISTING,
      this.selectedPageSize.toString()
    )
  }
}
