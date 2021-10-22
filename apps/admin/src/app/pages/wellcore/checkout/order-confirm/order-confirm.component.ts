import { Component, Input, OnDestroy, OnInit } from '@angular/core'
@Component({
  selector: 'ccr-wellcore-order-confirm',
  templateUrl: './order-confirm.component.html',
  styleUrls: ['./order-confirm.component.scss']
})
export class WellcoreOrderConfirmComponent implements OnInit, OnDestroy {
  @Input() emailAddress: string

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
