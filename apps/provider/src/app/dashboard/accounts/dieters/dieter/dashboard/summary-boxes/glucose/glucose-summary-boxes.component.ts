import { Component, OnInit } from '@angular/core'
import { DataPointTypes } from '@coachcare/sdk'
import { ContextService, EventsService } from '@app/service'
import { MeasurementService } from '@app/service/measurement.service'
import { DataPointSummary } from '../model/data-point-summary'

@Component({
  selector: 'app-glucose-dieter-summary-boxes',
  templateUrl: './glucose-summary-boxes.component.html'
})
export class GlucoseDieterSummaryBoxesComponent implements OnInit {
  public glucose: DataPointSummary = new DataPointSummary()
  public fastingGlucose: DataPointSummary = new DataPointSummary()

  constructor(
    private context: ContextService,
    private measurement: MeasurementService,
    private bus: EventsService
  ) {}

  public async ngOnInit(): Promise<void> {
    const response = await this.measurement.getSummary({
      account: this.context.accountId,
      type: [DataPointTypes.GLUCOSE, DataPointTypes.FASTING_GLUCOSE]
    })

    this.glucose = this.glucose.update(response, DataPointTypes.GLUCOSE)
    this.fastingGlucose = this.fastingGlucose.update(
      response,
      DataPointTypes.FASTING_GLUCOSE
    )

    if (this.fastingGlucose.recentDate > this.glucose.recentDate) {
      this.bus.trigger(
        'summary-boxes.device-type.change',
        DataPointTypes.FASTING_GLUCOSE
      )
    }
  }
}
