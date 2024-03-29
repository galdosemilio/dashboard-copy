import { Component, OnInit } from '@angular/core'

import { EventsService } from '@app/service'

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html'
})
export class SupportComponent implements OnInit {
  constructor(private bus: EventsService) {}

  ngOnInit() {
    this.bus.trigger('right-panel.deactivate')
  }
}
