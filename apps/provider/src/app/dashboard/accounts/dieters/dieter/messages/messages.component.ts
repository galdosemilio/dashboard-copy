import { Component, OnInit } from '@angular/core';

import { ContextService, EventsService, NotifierService } from '@app/service';
import { AccSingleResponse } from '@app/shared/selvera-api';

@Component({
  selector: 'app-dieter-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class DieterMessagesComponent implements OnInit {
  account: AccSingleResponse;

  constructor(public context: ContextService, private bus: EventsService) {}

  ngOnInit() {
    this.account = this.context.user;

    this.bus.trigger('right-panel.component.set', 'reminders');
  }
}
