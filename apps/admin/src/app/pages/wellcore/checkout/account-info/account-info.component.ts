import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class WellcoreAccountComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup

  constructor() {}

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' }
  ]

  ngOnInit() {}

  ngOnDestroy() {}
}
