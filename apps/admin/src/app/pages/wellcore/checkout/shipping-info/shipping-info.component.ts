import { Component, Input } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { SelectorOption } from '@coachcare/common/shared'
import { STATES_LIST } from '../../model'

@Component({
  selector: 'ccr-wellcore-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class WellcoreShippingInfoComponent {
  @Input() formGroup: FormGroup

  public states: SelectorOption[] = STATES_LIST
}
