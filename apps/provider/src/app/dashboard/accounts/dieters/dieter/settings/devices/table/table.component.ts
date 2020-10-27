import { Component, Input } from '@angular/core';

import { DevicesDataSource } from '@app/dashboard/accounts/dieters/dieter/settings/services';

@Component({
  selector: 'app-devices-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class DevicesTableComponent {
  @Input() source: DevicesDataSource;
  @Input() columns = ['device', 'status', 'synced'];

  constructor() {}
}
