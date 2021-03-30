import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core'
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR
} from '@angular/forms'
import { ccrInputMaskValidator } from '@app/shared/directives'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'ccr-tin-input',
  templateUrl: './tin-input.component.html',
  styleUrls: ['./tin-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CcrTinInputComponent),
      multi: true
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CcrTinInputComponent implements ControlValueAccessor, OnInit {
  @Input() isClearable = false
  @Input() isInherited = false
  @Input() readonly = false
  @Input() required = false

  @Output() onClearTin: EventEmitter<void> = new EventEmitter<void>()

  public form: FormGroup
  public maskFormat = '##-#######'

  private propagateChange: (value: any) => void = () => {}

  constructor(private fb: FormBuilder) {}

  public ngOnInit(): void {
    this.createForm()
  }

  public clearTin(): void {
    this.onClearTin.emit()
  }

  private createForm(): void {
    this.form = this.fb.group({
      tin: ['', [ccrInputMaskValidator(this.maskFormat, this.required)]]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((value) => {
      if (this.form.invalid) {
        this.propagateChange(null)
        return
      }

      this.propagateChange(value.tin)
    })
  }

  public registerOnChange(fn: any): void {
    this.propagateChange = fn
  }

  public registerOnTouched(): void {
    this.form.markAllAsTouched()
  }

  public setDisabledState(isDisabled: boolean): void {
    if (!this.form) {
      return
    }

    if (isDisabled) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  public writeValue(value: string): void {
    if (!this.form) {
      return
    }

    this.form.patchValue({ tin: value })
  }
}
