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
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { CcrPaginator } from '@app/shared/components/paginator'
import { Locale, LocaleSelectEvents } from '../locales'

@UntilDestroy()
@Component({
  selector: 'app-locale-table',
  templateUrl: './locale-table.component.html'
})
export class LocaleTableComponent implements OnDestroy, OnInit {
  @ViewChild(CcrPaginator, { static: false })
  paginator: CcrPaginator

  @Input()
  set array(a: Array<Locale>) {
    this._array = a
    if (!this.useSource) {
      this.shiftShownElements()
      this.localeEvents.emit(this.array)
    } else {
      this.syncShownElements()
    }
  }
  get array(): Array<Locale> {
    return this._array.slice()
  }

  @Input()
  events: LocaleSelectEvents
  @Input()
  source: any[]
  @Input()
  useSource = true

  @Output()
  localeEvents: EventEmitter<Array<Locale>> = new EventEmitter<Array<Locale>>()

  public columns = ['check', 'title']
  public shownElements: Array<Locale> = []
  public pageIndex = 0
  // pageSize for now if we get pagination
  public pageSize = 999

  private _array: Array<Locale> = []

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.useSource) {
      this.shownElements = this.source
      this.syncShownElements()
    } else if (this.array) {
      this.shiftShownElements()
    }
    this.subscribeToEvents()
  }

  ngOnDestroy() {
    if (this.source) {
      this.source = []
    }
  }

  onCheckClick(locale: Locale) {
    const index: number = this.shownElements.findIndex(
      (l: Locale) => l.code === locale.code
    )
    if (!this.shownElements[index].checked) {
      this.events.localeSelected.emit(this.shownElements[index])
    } else {
      this.events.localeDeselected.emit(this.shownElements[index])
    }
  }

  private shiftShownElements(
    start: number = this.pageIndex * this.pageSize,
    end: number = (this.pageIndex + 1) * this.pageSize
  ) {
    const resultArr: Array<Locale> = []
    for (let i = start; i < end && i < this.array.length; ++i) {
      resultArr.push(this.array[i])
    }
    this.shownElements = resultArr
    this.cdr.detectChanges()
  }

  private subscribeToEvents() {
    this.events.localeSelected
      .pipe(untilDestroyed(this))
      .subscribe((lcl: Locale) => {
        if (!this.useSource) {
          const newArray: any[] = this.array
          newArray.push({ ...lcl, checked: true })
          this.array = newArray
        }
        const index: number = this.shownElements.findIndex(
          (l: Locale) => l.code === lcl.code
        )
        if (index > -1) {
          this.shownElements[index].checked = true
          this.shownElements = this.shownElements.slice()
        }
      })

    this.events.localeDeselected
      .pipe(untilDestroyed(this))
      .subscribe((locale: Locale) => {
        if (!this.useSource) {
          const newArray: Array<Locale> = this.array.filter(
            (l: Locale) => l.code !== locale.code
          )
          this.array = newArray
          this.pageIndex = 0
        }
        const index: number = this.shownElements.findIndex(
          (l: Locale) => l.code === locale.code
        )
        if (index > -1) {
          this.shownElements[index].checked = false
        }
      })
  }

  private syncShownElements() {
    if (this.array && this.array.length) {
      this.shownElements.forEach((sE: Locale) => {
        if (this.array.find((el: Locale) => el.code === sE.code)) {
          sE.checked = true
        }
      })
    }
  }
}
