import { Component, ViewChild } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { StorefrontUserService } from '@coachcare/storefront/services'
import { UntilDestroy } from '@ngneat/until-destroy'
import {
  StripeCardElementOptions,
  StripeElementsOptions,
  Token
} from '@stripe/stripe-js'
import { StripeCardComponent, StripeService } from 'ngx-stripe'

@UntilDestroy()
@Component({
  selector: 'ccr-storefront-payment-method-dialog',
  templateUrl: './payment-method.dialog.html',
  host: { class: 'ccr-dialog' },
  styleUrls: ['./payment-method.dialog.scss']
})
export class StorefrontPaymentMethodDialog {
  public errorMessage: string
  private token: Token

  public elementsOptions: StripeElementsOptions = { locale: 'en' }
  @ViewChild(StripeCardComponent) cardComponent: StripeCardComponent

  constructor(
    private dialogRef: MatDialogRef<{ id: string; qty: number }>,
    private stripeService: StripeService,
    private storefrontUserService: StorefrontUserService
  ) {}

  public cardOptions: StripeCardElementOptions = {
    hidePostalCode: true,
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#000',
        fontWeight: '400',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  }

  public async onChange($event): Promise<void> {
    try {
      this.token = null
      this.errorMessage = null

      if (!$event.complete) {
        return
      }

      const response = await this.stripeService
        .createToken(this.cardComponent.element, {
          name: `${this.storefrontUserService.user.firstName} ${this.storefrontUserService.user.lastName}`
        })
        .toPromise()

      if (response.error) {
        this.errorMessage = response.error.message
        return
      }

      this.token = response.token
    } catch (error) {
      this.errorMessage = error.message
    }
  }

  public onSubmit() {
    if (!this.token) {
      return
    }

    this.dialogRef.close(this.token)
  }
}
