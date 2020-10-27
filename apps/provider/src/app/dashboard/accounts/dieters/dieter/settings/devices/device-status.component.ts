import { Component, OnInit } from '@angular/core';
import {
  DevicesDatabase,
  DevicesDataSource
} from '@app/dashboard/accounts/dieters/dieter/settings/services';
import { ContextService, NotifierService } from '@app/service';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss']
})
export class DeviceStatusComponent implements OnInit {
  source: DevicesDataSource;

  constructor(
    private notifier: NotifierService,
    private database: DevicesDatabase,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.source = new DevicesDataSource(this.notifier, this.database);
    this.source.addDefault({ dieterId: this.context.accountId });
  }
}
