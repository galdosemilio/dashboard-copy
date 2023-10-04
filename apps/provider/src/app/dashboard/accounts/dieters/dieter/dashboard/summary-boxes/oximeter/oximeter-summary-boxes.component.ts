import { Component, OnInit } from '@angular/core'
import { ContextService } from '@app/service'
import { MeasurementService } from '@app/service/measurement.service'
import { DataPointSummary } from '../model/data-point-summary'
import { DataPointTypes } from '@coachcare/sdk'

@Component({
  selector: 'app-oximeter-dieter-summary-boxes',
  templateUrl: './oximeter-summary-boxes.component.html'
})
export class OximeterDieterSummaryBoxesComponent implements OnInit {
  public heartRate: DataPointSummary = new DataPointSummary()
  public currentPerfusion: DataPointSummary = new DataPointSummary()
  public spo2: DataPointSummary = new DataPointSummary()

  constructor(
    private context: ContextService,
    private measurement: MeasurementService
  ) {}

  public async ngOnInit(): Promise<void> {
    const response = await this.measurement.getSummary({
      account: this.context.accountId,
      type: [
        DataPointTypes.PERFUSION_INDEX,
        DataPointTypes.BLOOD_OXYGEN_LEVEL,
        DataPointTypes.HEART_RATE
      ]
    })

    this.currentPerfusion = this.currentPerfusion.update(
      response,
      DataPointTypes.PERFUSION_INDEX
    )
    this.spo2 = this.spo2.update(response, DataPointTypes.BLOOD_OXYGEN_LEVEL)
    this.heartRate = this.heartRate.update(response, DataPointTypes.HEART_RATE)
  }
}
