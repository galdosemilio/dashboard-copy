import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms'
import { UserAddress } from '@app/shared'
import { AddressLabel } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    }
  ]
})
export class AddressFormComponent
  implements ControlValueAccessor, OnInit, OnDestroy, Validator {
  form: FormGroup

  @Input() types: AddressLabel[] = []

  @Input() markAsTouched: Subject<void>

  @Output() changeAddress = new EventEmitter<any>()

  constructor(private builder: FormBuilder, private cdr: ChangeDetectorRef) {}

  public ngOnInit() {
    // setup the FormGroup
    this.createForm()
  }

  public ngOnDestroy(): void {}

  private propagateChange(data: any): void {}

  public propagateTouch(): void {}

  public registerOnChange(fn): void {
    this.propagateChange = fn
  }

  public registerOnTouched(fn: any): void {
    this.propagateTouch = fn
  }

  public writeValue(value: UserAddress): void {
    if (value) {
      this.form.patchValue({
        labels: value.labels,
        address1: value.address1,
        address2: value.address2,
        city: value.city,
        stateProvince: value.stateProvince,
        country: value.country,
        postalCode: value.postalCode
      })
    }
  }

  private createForm(): void {
    this.form = this.builder.group({
      labels: [[], Validators.required],
      address1: ['', Validators.required],
      address2: null,
      city: ['', Validators.required],
      stateProvince: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['US', Validators.required]
    })

    this.form.valueChanges
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe((controls) => {
        this.onChange(controls)
      })

    this.markAsTouched &&
      this.markAsTouched.pipe(untilDestroyed(this)).subscribe(() => {
        this.form.markAsTouched()
        Object.keys(this.form.controls).forEach((key) => {
          this.form.controls[key].markAsTouched()
        })
        this.cdr.detectChanges()
      })
  }

  private onChange(value) {
    this.propagateChange(this.form.valid ? value : null)
  }

  public validate(control: AbstractControl): ValidationErrors {
    if (this.form.valid) {
      return null
    }

    let errors: ValidationErrors = {}

    Object.keys(this.form.controls).forEach((field) => {
      if (control.touched) {
        errors = this.addControlErrors(errors, field)
      }
    })

    return errors
  }

  private addControlErrors(
    allErrors: ValidationErrors,
    controlName: string
  ): ValidationErrors {
    const errors = { ...allErrors }
    const controlErrors = this.form.controls[controlName].errors

    if (controlErrors) {
      errors[controlName] = controlErrors
    }

    return errors
  }
}
