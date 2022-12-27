import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms'
import { MatAutocompleteTrigger } from '@angular/material/autocomplete'
import { UserAddress } from '@app/shared'
import { AddressProvider, AddressSuggestion } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime, filter, map, switchMap } from 'rxjs/operators'
import { LabelOption } from '../addresses/addresses.component'

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
  implements ControlValueAccessor, OnInit, OnDestroy, Validator
{
  form: FormGroup

  @Input() types: LabelOption[] = []

  @Input() markAsTouched: Subject<void>
  @Input() mode: 'create' | 'edit' = 'edit'
  @Input() readonly: boolean = false

  @Output() changeAddress = new EventEmitter<any>()

  public autocomplete = new FormControl('')
  public addressSuggestion: Array<AddressSuggestion> = []

  @ViewChild(MatAutocompleteTrigger) inputAutoComplete: MatAutocompleteTrigger

  constructor(
    private builder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private address: AddressProvider
  ) {}

  public ngOnInit() {
    // setup the FormGroup
    this.createForm()

    if (this.mode === 'create') {
      this.form
        .get('address1')
        .valueChanges.pipe(
          debounceTime(500),
          untilDestroyed(this),
          filter((val) => !!val && typeof val === 'string'),
          switchMap((val) => {
            return this.address.getAddressSuggestion({
              query: val || ''
            })
          }),
          map((res) => res.data)
        )
        .subscribe((addresses) => {
          if (addresses.length > 0) {
            this.addressSuggestion = addresses
            this.inputAutoComplete.openPanel()
          }
        })
    }
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

    if (this.readonly) {
      this.form.disable()
    }

    this.form.valueChanges
      .pipe(
        untilDestroyed(this),
        debounceTime(500),
        filter((controls) => typeof controls?.address1 === 'string')
      )
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
    this.propagateChange(
      this.form.valid
        ? {
            ...value,
            address2: value.address2
              ? value.address2
              : this.mode === 'create'
              ? undefined
              : null
          }
        : null
    )
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

  public selectAutoSuggestion(address: AddressSuggestion) {
    this.form.patchValue(
      {
        address1: address.address1,
        address2: '',
        city: address.city,
        stateProvince: address.stateProvince,
        postalCode: address.postalCode
      },
      { emitEvent: false }
    )

    this.onChange(this.form.value)
  }
}
