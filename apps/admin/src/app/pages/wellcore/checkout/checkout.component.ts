import { Component, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
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

  constructor(private fb: FormBuilder) {}
  public accountInfo: FormGroup
  public billingInfo: FormGroup
  public paymentInfo: FormGroup
  public orderReview: FormGroup
  public orderConfirm: FormGroup
  public step = 0

  public ngOnInit(): void {
    this.createForm()
  }

  private createForm(): void {
    this.accountInfo = this.fb.group({})
    this.billingInfo = this.fb.group({})
    this.paymentInfo = this.fb.group({})
    this.orderReview = this.fb.group({})
    this.orderConfirm = this.fb.group({})
  }

  public nextStep(): void {
    this.stepper.next()
    this.step += 1
  }

  public prevStep(): void {
    this.stepper.previous()
    this.step += 1
  }
}
