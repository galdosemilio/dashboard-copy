import { Component, OnInit } from '@angular/core';

import { EventsService } from '@app/service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  constructor(private bus: EventsService) {}

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate');
  }
}
