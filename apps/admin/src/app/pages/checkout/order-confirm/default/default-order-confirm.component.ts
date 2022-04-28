import { Component, OnInit } from '@angular/core'
import { EventsService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-default-order-confirm',
  templateUrl: './default-order-confirm.component.html'
})
export class DefaultOrderConfirmComponent implements OnInit {
  constructor(private bus: EventsService) {}

  public ngOnInit(): void {
    this.subscribeToEvents()
  }

  private subscribeToEvents(): void {
    this.bus.register(
      'checkout.redirection.start',
      () => (window.location.href = window.location.origin)
    )
  }
}
