import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatSelect, MatSelectChange } from '@coachcare/material'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { DieterDashboardSummary } from '@coachcare/npm-api'

import { CCRConfig } from '@app/config'
import {
  MeasurementDatabase,
  MeasurementDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-dieter-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DieterDashboardComponent implements OnInit, OnDestroy {
  currentMeasurement: string
  isLoading = true
  metrics: string[] = ['weight', 'bmi', 'bodyFat', 'leanMass', 'steps', 'total']
  usesNewEndpoint: string[] = ['weight', 'bmi', 'bodyFat', 'leanMass']
  refresh$: Subject<void> = new Subject<void>()
  source: MeasurementDataSource | null
  zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018829432-Viewing-the-Patient-Dashboard'

  @ViewChild(MatSelect, { static: false })
  activitySelector: MatSelect

  constructor(
    private translator: TranslateService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService,
    private database: MeasurementDatabase,
    private store: Store<CCRConfig>,
    public data: DieterDashboardSummary
  ) {}

  activityLevels = [
    { value: -1, viewValue: _('MEASUREMENT.BMR') },
    { value: 0, viewValue: _('SELECTOR.LEVEL.NONE') },
    { value: 2, viewValue: _('SELECTOR.LEVEL.LOW') },
    { value: 4, viewValue: _('SELECTOR.LEVEL.MEDIUM') },
    { value: 7, viewValue: _('SELECTOR.LEVEL.HIGH') },
    { value: 10, viewValue: _('SELECTOR.LEVEL.INTENSE') }
  ]

  ngOnInit() {
    // default level is low
    this.data.init(this.context.accountId)
    this.currentMeasurement = this.metrics[0]

    this.currentMeasurement = this.metrics[0]

    this.source = new MeasurementDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.context,
      this.store
    )
    this.source.addDefault({
      account: this.context.accountId,
      useNewEndpoint: true
    })
    this.source.addOptional(this.refresh$, () => ({
      useNewEndpoint: this.usesNewEndpoint.indexOf(this.currentMeasurement) > -1
    }))

    this.source.addOptional(this.refresh$, () => ({
      useNewEndpoint: this.usesNewEndpoint.indexOf(this.currentMeasurement) > -1
    }))

    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  ngOnDestroy() {
    this.source.disconnect()
    this.bus.trigger('right-panel.component.set', '')
  }

  chartChanged($event) {
    this.currentMeasurement = $event.measurement
    this.refresh$.next()
  }

  setupActivityLevel(): void {
    if (this.data.haveBMRData) {
      this.activitySelector.open()
    }
  }

  selectActivityLevel(event: MatSelectChange): void {
    this.data.update(event.value === -1 ? null : event.value)
  }
}
