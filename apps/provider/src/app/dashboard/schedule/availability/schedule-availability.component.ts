import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

import { CCRConfig } from '@app/config'
import { OpenPanel } from '@app/layout/store'
import { EventsService } from '@app/service'

@Component({
  selector: 'app-schedule-availability',
  templateUrl: './schedule-availability.component.html',
  styleUrls: ['./schedule-availability.component.scss']
})
export class ScheduleAvailabilityComponent implements OnInit {
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020732751-Setting-your-Schedule-Availability'

  constructor(private store: Store<CCRConfig>, private bus: EventsService) {}

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.component.set', 'addConsultation')
  }

  addUnavailableForm(): void {
    this.store.dispatch(new OpenPanel())
    this.bus.trigger('right-panel.consultation.form', {
      form: 'addUnavailability'
    })
  }
}
