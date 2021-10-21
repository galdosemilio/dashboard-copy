import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class WellcoreShippingInfoComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup

  constructor() {}

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]

  ngOnInit() {}

  ngOnDestroy() {}
}
