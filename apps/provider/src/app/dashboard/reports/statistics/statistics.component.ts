import { ChangeDetectorRef, Component, OnInit } from '@angular/core'
import { Subject } from 'rxjs'

import { MeasurementTimeframe } from '@app/dashboard/accounts/dieters/services'
import { EventsService } from '@app/service'

@Component({
  selector: 'app-reports-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  constructor(private bus: EventsService) {}

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')
  }
}
