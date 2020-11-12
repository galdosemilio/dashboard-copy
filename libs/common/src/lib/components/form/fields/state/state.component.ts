// TODO move to an autocompleter
import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SkipSelf
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { STATES, StateSegment } from '@coachcare/common/shared'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ccr-form-field-state',
  templateUrl: './state.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StateFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => StateFormFieldComponent),
      multi: true
    }
  ],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled'
  }
})
export class StateFormFieldComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() formControlName: string

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Input()
  set country(country: string) {
    this.updateByCountry(country)
  }

  @Output() change = new EventEmitter<any>()

  _control: AbstractControl | undefined
  selected: string
  states: Array<StateSegment>
  language: string
  langSub: Subscription

  get isDisabled() {
    return this.disabled === '' || this.disabled === true
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true
  }
  get isRequired() {
    return this.required === '' || this.required === true
  }

  constructor(
    translate: TranslateService,
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer
  ) {
    this.states = STATES

    this.language = translate.currentLang
    this.langSub = translate.onLangChange.subscribe(
      (event: LangChangeEvent) => (this.language = event.lang)
    )
  }

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }
  }

  ngOnDestroy() {
    this.langSub.unsubscribe()
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange() {
    this.propagateChange(this.selected)
    this.change.emit(this.selected)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: string): void {
    if (value) {
      this.selected = value
      this.onChange()
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  validate(c: FormControl) {
    if (!this.isDisabled && this.isRequired) {
      if (!c.value) {
        return { ccrFieldState: 'required' }
      }
    }
    return null
  }

  private updateByCountry(country: string) {
    this.states = country
      ? STATES.filter((state) => state.country === country)
      : STATES
  }
}
