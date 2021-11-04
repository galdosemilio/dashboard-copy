import { Component, OnInit, ViewChild } from '@angular/core'
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms'
import { Router } from '@angular/router'
import { MatStepper } from '@coachcare/material'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

export interface CheckoutData {
  accountInfo?: {
    firstName: string
    lastName: string
    email: string
    emailConfirmation: string
    password: string
    passwordConfirmation: string
    phoneNumber: string
    gender: string
    height?: string
    birthday?: Date
  }
  paymentInfo?: {
    billingInfo: {
      firstName: string
      lastName: string
      address1: string
      address2?: string
      city: string
      state: string
      zip: string
    }
    creditCardInfo: {
      stripeToken: string
      last4: string
      exp_month: string
      exp_year: string
    }
  }
  shippingInfo?: {
    firstName: string
    lastName: string
    address1: string
    address2?: string
    city: string
    state: string
    zip: string
  }
}

@UntilDestroy()
@Component({
  selector: 'ccr-wellcore-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class WellcoreCheckoutComponent implements OnInit {
  @ViewChild('stepper', { static: true })
  stepper: MatStepper

  constructor(private fb: FormBuilder, private router: Router) {}
  public accountInfo: FormGroup
  public shippingInfo: FormGroup
  public paymentInfo: FormGroup
  public orderReview: FormGroup
  public orderConfirm: FormGroup
  public step = 0
  public checkoutData: CheckoutData = {}
  public emailAddress: string
  public useShippingAddress: boolean = true

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.accountInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      emailConfirmation: ['', [this.validateEmailMatches()]],
      password: ['', [Validators.required]],
      passwordConfirmation: ['', [this.validatePasswordMatches()]],
      phoneNumber: ['', Validators.required],
      gender: ['', Validators.required],
      height: ['', Validators.required],
      birthday: ['', Validators.required]
    })
    this.shippingInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    })
    this.paymentInfo = this.fb.group({
      billingInfo: this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        address1: ['', Validators.required],
        address2: [''],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zip: ['', Validators.required]
      }),
      creditCardInfo: this.fb.group({
        stripeToken: ['', Validators.required],
        last4: ['', Validators.required],
        exp_month: ['', Validators.required],
        exp_year: ['', Validators.required]
      })
    })
    this.orderReview = this.fb.group({})
    this.orderConfirm = this.fb.group({})

    this.accountInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((control) => (this.checkoutData.accountInfo = control))

    this.paymentInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => (this.checkoutData.paymentInfo = controls))

    this.shippingInfo.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls) => {
        this.checkoutData.shippingInfo = controls
        if (this.useShippingAddress) {
          this.paymentInfo.controls.billingInfo.patchValue(controls)
        }
      })
  }

  public nextStep(): void {
    this.stepper.next()
    this.step += 1

    if (this.step === 4) {
      this.emailAddress = this.accountInfo.value.email

      setTimeout(() => {
        window.location.href = 'https://dashboard.coachcare.com/6891'
      }, 8000)
    }
  }

  public prevStep(): void {
    if (this.step > 0) {
      this.stepper.previous()
      this.step -= 1
    } else {
      this.router.navigate(['/wellcore/cart'])
    }
  }

  public onChangeUseShippingAddress(value: boolean): void {
    this.useShippingAddress = value

    const patchValue = this.useShippingAddress
      ? this.shippingInfo.value
      : {
          firstName: '',
          lastName: '',
          address1: '',
          address2: '',
          city: '',
          state: '',
          zip: ''
        }

    this.paymentInfo.controls.billingInfo.patchValue(patchValue)
  }

  private validateEmailMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.checkoutData.accountInfo?.email
        ? null
        : { wrongMatch: true }
    }
  }

  private validatePasswordMatches(): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === this.checkoutData.accountInfo?.password
        ? null
        : { wrongMatch: true }
    }
  }
}
