import { Component, OnInit } from '@angular/core'

import { EventsService } from '@app/service'

@Component({
  selector: 'app-reports-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020078472-Viewing-the-Reports-Overview'

  constructor(private bus: EventsService) {}

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')
  }
}
