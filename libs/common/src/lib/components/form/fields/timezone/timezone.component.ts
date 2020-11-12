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
import { TimezoneItem, TIMEZONES } from '@coachcare/common/shared'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { find } from 'lodash'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ccr-form-field-timezone',
  templateUrl: './timezone.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimezoneFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimezoneFormFieldComponent),
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
export class TimezoneFormFieldComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() formControlName: string

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<any>()

  _control: AbstractControl | undefined
  selected: string
  timezones: Array<TimezoneItem>
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
    this.timezones = TIMEZONES

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
      let item = find(this.timezones, { value })
      if (!item) {
        // add the existing value to the end of the list
        item = {
          value,
          viewValue: {
            en: value,
            es: value
          }
        }
        this.timezones.push(item)
      }
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
        return { ccrFieldTimezone: 'required' }
      }
    }
    return null
  }
}
