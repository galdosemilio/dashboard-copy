import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { STATES_LIST, WhitelistedSelectorOption } from '../../model'
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'
import { StripeCardComponent, StripeService } from 'ngx-stripe'

@Component({
  selector: 'ccr-wellcore-billing-info',
  templateUrl: './billing-info.component.html'
})
export class WellcoreBillingInfoComponent {
  @Input() formGroup: FormGroup
  @Input() useShippingAddress: boolean

  @Output()
  onChangeUseShippingAddress: EventEmitter<boolean> = new EventEmitter<boolean>()

  @ViewChild(StripeCardComponent) cardComponent: StripeCardComponent

  public stripeErrorMessage?: string

  constructor(private stripeService: StripeService) {}

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#FFFFFF',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  }
  public elementsOptions: StripeElementsOptions = { locale: 'en' }

  public states: WhitelistedSelectorOption[] = STATES_LIST

  public async onChange($event): Promise<void> {
    try {
      if (!$event.complete) {
        return
      }

      const response = await this.stripeService
        .createToken(this.cardComponent.element, { name: 'somename' })
        .toPromise()

      this.formGroup.patchValue({
        cardInfo: {
          token: response.token.id,
          id: response.token.card.id,
          expMonth: response.token.card.exp_month,
          expYear: response.token.card.exp_year,
          last4: response.token.card.last4,
          type: response.token.card.brand
        }
      })
    } catch (error) {
      this.stripeErrorMessage = error
      console.error(error)
    }
  }

  public onChangeAddressOption(value: boolean): void {
    this.onChangeUseShippingAddress.emit(value)
  }
}
