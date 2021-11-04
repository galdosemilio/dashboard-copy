import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { StripeService, StripeCardComponent } from 'ngx-stripe'
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js'
import { SelectorOption } from '@coachcare/common/shared'
import { STATES_LIST } from '../../model'

@Component({
  selector: 'ccr-wellcore-billing-info',
  templateUrl: './billing-info.component.html'
})
export class WellcoreBillingInfoComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent

  @Input() billingFormGroup: FormGroup
  @Input() creditFormGroup: FormGroup
  @Input() useShippingAddress: boolean

  @Output()
  onChangeUseShippingAddress: EventEmitter<boolean> = new EventEmitter<boolean>()

  public states: SelectorOption[] = STATES_LIST
  public stripeErrorMessage: string

  public cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: 'white',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '20px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  }

  public elementsOptions: StripeElementsOptions = {
    locale: 'en'
  }

  constructor(private stripeService: StripeService) {}

  ngOnInit(): void {}

  onChange(event: StripeCardElementChangeEvent) {
    this.stripeErrorMessage = ''
    this.creditFormGroup.patchValue({
      stripeToken: null,
      last4: null,
      exp_month: null,
      exp_year: null
    })

    if (event.error) {
      this.stripeErrorMessage = event.error.message
    }

    if (event.complete) {
      this.stripeService.createToken(this.card.element).subscribe((result) => {
        if (result.token) {
          // Use the token
          this.creditFormGroup.patchValue({
            stripeToken: result.token.id,
            last4: result.token.card.last4,
            exp_month: result.token.card.exp_month,
            exp_year: result.token.card.exp_year
          })
        } else if (result.error) {
          // Error creating the token
          this.stripeErrorMessage = result.error.message
        }
      })
    }
  }

  public onChangeAddressOption(value: boolean): void {
    this.onChangeUseShippingAddress.emit(value)
  }
}
