import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { STATES_LIST, WhitelistedSelectorOption } from '../../model'

@Component({
  selector: 'ccr-wellcore-billing-info',
  templateUrl: './billing-info.component.html'
})
export class WellcoreBillingInfoComponent implements OnInit {
  @Input() formGroup: FormGroup
  @Input() useShippingAddress: boolean

  @Output()
  onChangeUseShippingAddress: EventEmitter<boolean> = new EventEmitter<boolean>()

  public states: WhitelistedSelectorOption[] = STATES_LIST

  constructor() {}

  ngOnInit(): void {}

  public onChangeAddressOption(value: boolean): void {
    this.onChangeUseShippingAddress.emit(value)
  }
}
