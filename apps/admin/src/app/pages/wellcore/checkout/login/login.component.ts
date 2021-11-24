import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'

@Component({
  selector: 'ccr-wellcore-login',
  templateUrl: './login.component.html'
})
export class WellcoreLoginComponent implements OnInit, OnDestroy {
  @Input() formGroup: FormGroup

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
