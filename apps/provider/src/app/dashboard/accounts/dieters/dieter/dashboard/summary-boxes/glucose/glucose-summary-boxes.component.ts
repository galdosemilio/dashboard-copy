import { Component, OnInit } from '@angular/core'
import { DataPointTypes } from '@coachcare/sdk'
import { ContextService } from '@app/service'
import { MeasurementService } from '@app/service/measurement.service'
import { DataPointSummary } from '../model/data-point-summary'

@Component({
  selector: 'app-glucose-dieter-summary-boxes',
  templateUrl: './glucose-summary-boxes.component.html'
})
export class GlucoseDieterSummaryBoxesComponent implements OnInit {
  public glucose: DataPointSummary = new DataPointSummary()

  constructor(
    private context: ContextService,
    private measurement: MeasurementService
  ) {}

  public async ngOnInit(): Promise<void> {
    const response = await this.measurement.getSummary({
      account: this.context.accountId,
      type: [DataPointTypes.GLUCOSE]
    })

    this.glucose = this.glucose.update(response, DataPointTypes.GLUCOSE)
  }
}
