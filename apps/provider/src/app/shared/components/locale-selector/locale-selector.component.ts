import {
  Component,
  EventEmitter,
  forwardRef,
  Host,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { MatDialog, MatInput } from '@coachcare/material'
import { find, get } from 'lodash'

import { LOCALES } from '@app/shared/utils'
import { LocaleSelectDialog } from './dialog'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'ccr-form-field-locale',
  templateUrl: './locale-selector.component.html',
  styleUrls: ['./locale-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LocaleFormFieldComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LocaleFormFieldComponent),
      multi: true
    }
  ],
  // eslint-disable-next-line
  host: {
    class: 'mat-form-field',
    '[class.mat-input-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-invalid]': '_control?.invalid && _control?.touched',
    '[class.mat-form-field-disabled]': '_control?.disabled',
    '[class.mat-form-field-autofilled]': '_control?.autofilled'
  }
})
export class LocaleFormFieldComponent implements ControlValueAccessor, OnInit {
  @Input() formControlName: string
  @Input() focus: any

  @Input() disabled: any
  @Input() placeholder: string
  @Input() readonly: any
  @Input() required: any

  @Output() change = new EventEmitter<Array<string>>()

  @ViewChild(MatInput, { static: false }) _input: MatInput

  _control: AbstractControl | undefined
  value: Array<string> = []
  displayValue = ''

  get isDisabled() {
    return this.disabled === '' || this.disabled === true
  }
  get isReadonly() {
    return this.readonly === '' || this.readonly === true
  }
  get isRequired() {
    return this.required === '' || this.required === true
  }
  get hasAutofocus() {
    return this.focus === '' || this.focus === true
  }

  constructor(
    @Optional()
    @Host()
    @SkipSelf()
    private parent: ControlContainer,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (this.formControlName) {
      const parent = this.parent.control as AbstractControl
      this._control = parent.get(this.formControlName) as AbstractControl
    }

    if (this.hasAutofocus) {
      this._input.focus()
    }
  }

  propagateChange = (data: any) => {}
  propagateTouch = () => {}

  onChange(value: Array<string>) {
    this.value = value
    this.displayValue = value
      .map((code) => get(find(LOCALES, { code }), 'lang', 'Error'))
      .join(', ')

    this.propagateChange(this.value)
    this.change.emit(this.value)
  }

  /**
   * Control Value Accessor Methods
   */
  writeValue(value: Array<string>): void {
    if (value) {
      this.value = value
      this.onChange(value)
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = (data: any) => {
      fn(data)
      this.updateErrorState()
    }
  }

  registerOnTouched(fn: any): void {
    this.propagateTouch = () => {
      fn()
      this.updateErrorState()
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  validate(c: FormControl) {
    if (this.isRequired && !c.value) {
      return { ccrFieldLocale: 'required' }
    }
    return null
  }

  private updateErrorState() {
    if (this._control) {
      this._input.errorState = this._control.invalid
      this._input.stateChanges.next()
    }
  }

  /**
   * Dialog
   */
  openDialog() {
    this.dialog
      .open(LocaleSelectDialog, {
        disableClose: true,
        data: {
          locales: this.value ? this.value.slice() : []
        },
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .pipe(filter((preferredLocales) => preferredLocales))
      .subscribe((preferredLocales: Array<string>) => {
        if (preferredLocales.length) {
          this.onChange(preferredLocales)
        } else {
          this.onChange([])
        }
      })
  }
}
