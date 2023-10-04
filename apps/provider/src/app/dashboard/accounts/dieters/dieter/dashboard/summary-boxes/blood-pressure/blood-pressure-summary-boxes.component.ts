import { Component, OnInit } from '@angular/core'
import { ContextService } from '@app/service'
import { MeasurementService } from '@app/service/measurement.service'
import { DataPointTypes } from '@coachcare/sdk'
import { DataPointSummary } from '../model/data-point-summary'

@Component({
  selector: 'app-blood-pressure-dieter-summary-boxes',
  templateUrl: './blood-pressure-summary-boxes.component.html'
})
export class BloodPressureDieterSummaryBoxesComponent implements OnInit {
  public diastolic: DataPointSummary = new DataPointSummary()
  public systolic: DataPointSummary = new DataPointSummary()
  public heartRate: DataPointSummary = new DataPointSummary()

  constructor(
    private context: ContextService,
    private measurement: MeasurementService
  ) {}

  public async ngOnInit(): Promise<void> {
    const response = await this.measurement.getSummary({
      account: this.context.accountId,
      type: [
        DataPointTypes.BLOOD_PRESSURE_DIASTOLIC,
        DataPointTypes.BLOOD_PRESSURE_SYSTOLIC,
        DataPointTypes.HEART_RATE
      ]
    })

    this.diastolic = this.diastolic.update(
      response,
      DataPointTypes.BLOOD_PRESSURE_DIASTOLIC
    )
    this.systolic = this.systolic.update(
      response,
      DataPointTypes.BLOOD_PRESSURE_SYSTOLIC
    )
    this.heartRate = this.heartRate.update(response, DataPointTypes.HEART_RATE)
  }
}
