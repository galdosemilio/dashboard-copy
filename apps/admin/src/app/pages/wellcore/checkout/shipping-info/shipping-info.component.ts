import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { STATES_LIST, WhitelistedSelectorOption } from '../../model'

@Component({
  selector: 'ccr-wellcore-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class WellcoreShippingInfoComponent {
  @Input() formGroup: FormGroup

  public states: WhitelistedSelectorOption[] = STATES_LIST
}
