import { Component, OnInit } from '@angular/core'

import { EventsService } from '@app/service'

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  constructor(private bus: EventsService) {}

  ngOnInit() {
    this.bus.trigger('right-panel.deactivate')
  }
}
