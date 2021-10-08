import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'

import { CCRConfig } from '@app/config'
import { OpenPanel } from '@app/layout/store'
import { EventsService } from '@app/service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { AvailabilityManagementService } from '../service'

@UntilDestroy()
@Component({
  selector: 'app-schedule-availability',
  templateUrl: './schedule-availability.component.html',
  styleUrls: ['./schedule-availability.component.scss']
})
export class ScheduleAvailabilityComponent implements OnInit {
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360020732751-Setting-your-Schedule-Availability'
  public isDisabledAvailabilityManagement = false
  public isLoading = false

  constructor(
    private availabilityManagement: AvailabilityManagementService,
    private bus: EventsService,
    private store: Store<CCRConfig>
  ) {}

  ngOnInit() {
    this.availabilityManagement.init()

    this.availabilityManagement.isDisabledAvailabilityManagement$
      .pipe(untilDestroyed(this))
      .subscribe((isDisabled) => {
        this.isDisabledAvailabilityManagement = isDisabled
      })

    this.bus.trigger('right-panel.component.set', 'addConsultation')
  }

  addUnavailableForm(): void {
    this.store.dispatch(new OpenPanel())
    this.bus.trigger('right-panel.consultation.form', {
      form: 'addUnavailability'
    })
  }
}
