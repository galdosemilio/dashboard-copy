import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { MatStepper } from '@coachcare/material'
import { UntilDestroy } from '@ngneat/until-destroy'

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

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.accountInfo = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      gender: ['male'],
      height: [''],
      birthday: ['']
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
    this.paymentInfo = this.fb.group({})
    this.orderReview = this.fb.group({})
    this.orderConfirm = this.fb.group({})
  }

  public nextStep(): void {
    this.stepper.next()
    this.step += 1
  }

  public prevStep(): void {
    if (this.step > 0) {
      this.stepper.previous()
      this.step -= 1
    } else {
      this.router.navigate(['/wellcore/cart'])
    }
  }
}
