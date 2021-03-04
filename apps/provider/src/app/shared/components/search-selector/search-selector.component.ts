import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormControl } from '@angular/forms'
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger
} from '@angular/material/autocomplete'
import { SelectOption, SelectOptions, sleep } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { fromEvent, of } from 'rxjs'
import {
  debounceTime,
  mergeMap,
  sampleTime,
  skip,
  takeUntil
} from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-search-selector',
  templateUrl: './search-selector.component.html'
})
export class CcrSearchSelectorComponent implements OnInit {
  @Input() initialSelection?: SelectOption<any>
  @Input() label = ''
  @Input()
  set options(opts: SelectOptions<any>) {
    this._options = opts.slice()
    this.refreshShownOptions()
  }

  get options(): SelectOptions<any> {
    return this._options
  }

  @Input() placeholder = ''

  @Output()
  optionSelected: EventEmitter<SelectOption<any> | null> = new EventEmitter<SelectOption<any> | null>()

  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger
  @ViewChild('auto', { static: true }) autocomplete: MatAutocomplete
  @ViewChild('input', { static: true }) input: ElementRef

  public queryCtrl: FormControl
  public filteredOptions: SelectOptions<any> = []
  public readonly = false
  public shownOptions: SelectOptions<any> = []

  private _options: SelectOptions<any> = []
  private MAX_RESULT_AMOUNT = 100

  constructor() {
    this.autocompleteDisplayWith = this.autocompleteDisplayWith.bind(this)
  }

  public ngOnInit(): void {
    this.createForm()
    this.refreshShownOptions()

    if (this.initialSelection) {
      this.fulfillInitialLoad()
    }
  }

  public async autocompleteScroll(): Promise<void> {
    await sleep(100)
    if (!this.autocomplete.panel) {
      return
    }

    fromEvent(this.autocomplete.panel.nativeElement, 'scroll')
      .pipe(
        takeUntil(this.autocompleteTrigger.panelClosingActions),
        sampleTime(300),
        mergeMap(() => of(this.calculatePoints()))
      )
      .subscribe((pos: any) => this.handleScroll(pos))
  }

  public autocompleteDisplayWith(value: any): string {
    const foundOpt = this.shownOptions.find((opt) => opt.value === value)
    return foundOpt ? foundOpt.viewValue : value
  }

  public async clearQuery(): Promise<void> {
    this.queryCtrl.setValue('')
    this.optionSelected.emit(null)
    this.readonly = false
    await sleep(100)
    this.input.nativeElement.blur()
  }

  public fulfillInitialLoad(): void {
    this.queryCtrl.setValue(this.initialSelection.viewValue)
    this.readonly = true
    this.optionSelected.emit(this.initialSelection)
  }

  public onOptionSelected($event: MatAutocompleteSelectedEvent): void {
    this.readonly = true
    const foundOption = this.shownOptions.find(
      (opt) => opt.value === $event.option.value
    )

    if (!foundOption) {
      return
    }

    this.optionSelected.emit(foundOption)
  }

  private calculatePoints() {
    const el = this.autocomplete.panel.nativeElement
    return {
      height: el.offsetHeight,
      scrolled: el.scrollTop,
      total: el.scrollHeight
    }
  }

  private createForm(): void {
    this.queryCtrl = new FormControl({})

    this.queryCtrl.valueChanges
      .pipe(
        untilDestroyed(this),
        skip(this.initialSelection ? 1 : 0),
        debounceTime(300)
      )
      .subscribe((query) => {
        this.refreshShownOptions(query)
      })
  }

  private handleScroll(position) {
    if (
      position.height + position.scrolled >= position.total - 50 &&
      this.shownOptions.length < this.filteredOptions.length
    ) {
      this.shownOptions = [
        ...this.shownOptions,
        ...this.filteredOptions.slice(
          this.shownOptions.length,
          this.shownOptions.length + this.MAX_RESULT_AMOUNT
        )
      ]
    }
  }

  private refreshShownOptions(query = ''): void {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      this.filteredOptions = this.options
      this.shownOptions = this.filteredOptions.slice(0, this.MAX_RESULT_AMOUNT)
      return
    }

    const queryRegex = new RegExp(`${query}`, 'gi')

    this.filteredOptions = this.options.filter((opt) =>
      queryRegex.test(opt.viewValue)
    )

    this.shownOptions = this.filteredOptions.slice(0, this.MAX_RESULT_AMOUNT)

    if (this.autocomplete.panel) {
      this.autocomplete.panel.nativeElement.scrollTop = 0
    }
  }
}
