import {
  ChangeDetectorRef,
  Component,
  DoCheck,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { _ } from '@coachcare/common/shared/utils/i18n.utils'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-date-input',
  templateUrl: './date-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcrDateInputComponent),
      multi: true
    }
  ]
})
export class CcrDateInputComponent
  implements ControlValueAccessor, DoCheck, OnDestroy, OnInit {
  @Input() allowsEmpty = false
  @Input() errorMessage?: string
  @Input() formControlName?: string
  @Input() max?: moment.Moment
  @Input() min?: moment.Moment
  @Input() placeholder: string = _('BOARD.DATE_OF_BIRTH')
  @Input() readonly = false
  @Input() required = true
  @ViewChild('textInput', { static: true }) textInput
  @ViewChild('datepickerInput', { static: true }) datepickerInput

  datepickerMode: 'datepicker' | 'text' = 'datepicker'
  form: FormGroup
  format: string
  lastValidDate: string
  private parentControl: AbstractControl
  propagateChange: (date: moment.Moment) => {}

  constructor(
    private controlContainer: ControlContainer,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.onTouched = this.onTouched.bind(this)
  }

  ngOnDestroy(): void {}

  ngDoCheck(): void {
    if (!this.form || !this.formControlName) {
      return
    }

    if (this.parentControl.touched && !this.form.touched) {
      this.form.markAllAsTouched()
    }
  }

  ngOnInit(): void {
    this.parentControl = this.formControlName
      ? (this.controlContainer.control as FormGroup).get(this.formControlName)
      : null
    this.createForm()
    this.refreshFormat()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.refreshFormat())
  }

  registerOnChange(fn): void {
    this.propagateChange = fn
  }

  registerOnTouched(): void {}

  writeValue(value: moment.Moment): void {
    if (value) {
      this.form.controls.textDate.setValue(
        value.startOf('day').format(this.format)
      )
      this.form.controls.date.setValue(
        moment(value.format(this.format), this.format)
          .startOf('day')
          .toISOString()
      )
      this.cdr.detectChanges()
    }
  }

  onDatepickerFocus($event: any) {
    const currentDate = this.form.controls.date.value

    this.datepickerMode = 'text'
    this.cdr.detectChanges()

    if ($event && $event.target) {
      this.textInput.nativeElement.select()
      this.onTouched()
    }

    if (currentDate) {
      this.form.controls.textDate.setValue(
        moment(currentDate).format(this.format)
      )
      this.form.controls.date.setValue(
        moment(currentDate).format(this.format),
        {
          emitEvent: false
        }
      )
    }
  }

  onDatepickerBlur() {
    this.datepickerMode = 'datepicker'
    this.cdr.detectChanges()
    if (this.lastValidDate) {
      this.form.controls.date.setValue(moment(this.lastValidDate).toISOString())
    } else if (this.allowsEmpty) {
      this.form.controls.date.setValue(null)
    }
  }

  private createForm(): void {
    this.form = this.fb.group({
      textDate: [
        '',
        [
          (control: AbstractControl) => {
            if (!control.value || control.invalid) {
              return null
            }
            const momentObject = moment(control.value, this.format)
            if (momentObject.isValid()) {
              if (
                (this.min && momentObject.isBefore(this.min)) ||
                (this.max && momentObject.isAfter(this.max))
              ) {
                return { dateRangeError: true }
              }
              return null
            } else {
              return { dateFormatError: true }
            }
          }
        ]
      ],
      date: ['', []]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      let momentDate
      if (this.datepickerMode === 'text') {
        momentDate = moment(controls.textDate, this.format)
        this.lastValidDate = this.form.controls.textDate.valid
          ? momentDate.toISOString()
          : moment()
        if (this.form.controls.textDate.valid) {
          this.propagateChange(
            momentDate.isValid() ? momentDate.startOf('day') : null
          )
        }
      } else {
        momentDate = moment(controls.date, 'YYYY/MM/DD').startOf('day')
        if (this.form.controls.date.valid) {
          setTimeout(() =>
            this.propagateChange(momentDate.isValid() ? momentDate : null)
          )
        }
      }
    })
  }

  private onTouched(): void {
    if (this.form) {
      this.form.markAllAsTouched()
    }
  }

  private refreshFormat(): void {
    this.format = moment
      .localeData(this.translate.currentLang)
      .longDateFormat('L')
  }
}
