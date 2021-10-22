import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-billing-info',
  templateUrl: './billing-info.component.html'
})
export class WellcoreBillingInfoComponent {
  @Input() billingFormGroup: FormGroup
  @Input() creditFormGroup: FormGroup
}
