import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { EventsService } from '@coachcare/common/services'

@Component({
  selector: 'ccr-wellcore-container',
  templateUrl: './wellcore-container.component.html',
  styleUrls: ['./wellcore-container.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WellcoreContainerComponent implements OnInit {
  public requestCount = 0
  public showSpinner = false

  constructor(private bus: EventsService) {}

  public ngOnInit(): void {
    this.bus.register('wellcore.loading.show', (shouldShow) => {
      this.requestCount += shouldShow ? 1 : -1

      if (this.requestCount <= 0) {
        this.requestCount = 0
        this.showSpinner = false
        return
      }

      this.showSpinner = true
    })
  }
}
