import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'ccr-checkout-login',
  templateUrl: './login.component.html'
})
export class CheckoutLoginComponent {
  @Input() formGroup: FormGroup
}
