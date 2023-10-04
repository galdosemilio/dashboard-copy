import { Component, OnInit } from '@angular/core'
import { ContextService, EventsService } from '@app/service'
import { ReportsDatabase } from '@app/dashboard/reports/services'
import { DataPointTypes } from '@coachcare/sdk'

const serviceType = {
  RPM: '1',
  RTM: '3'
}

const deviceTypes = {
  weight: DataPointTypes.WEIGHT,
  bloodPressure: DataPointTypes.BLOOD_PRESSURE_SYSTOLIC,
  glucometer: DataPointTypes.GLUCOSE,
  pulseOximeter: DataPointTypes.BLOOD_OXYGEN_LEVEL
}

@Component({
  selector: 'app-default-dieter-summary-boxes',
  templateUrl: './default-summary-boxes.component.html'
})
export class DefaultDieterSummaryBoxesComponent implements OnInit {
  public summaryBoxDeviceType = ''
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018829432-Viewing-the-Patient-Dashboard'

  constructor(
    private context: ContextService,
    private database: ReportsDatabase,
    private bus: EventsService
  ) {}

  public async ngOnInit(): Promise<void> {
    await this.resolveRPMBillingStatus()
  }

  private async resolveRPMBillingStatus() {
    try {
      let response = await this.fetchCareManagementBillingSnapshot(
        serviceType.RPM
      )

      if (!response.data.length) {
        response = await this.fetchCareManagementBillingSnapshot(
          serviceType.RTM
        )
      }

      if (!response.data.length) {
        this.setSummaryBoxDeviceType('weight')
        return
      }

      const rpmBillingReportEntry = response.data.shift()

      switch (rpmBillingReportEntry?.state?.plan?.id?.toString()) {
        case '1':
          this.setSummaryBoxDeviceType('weight')
          break
        case '2':
          this.setSummaryBoxDeviceType('bloodPressure')
          break
        case '3':
          this.setSummaryBoxDeviceType('glucometer')
          break
        case '4':
          this.setSummaryBoxDeviceType('pulseOximeter')
          break
        default:
          this.setSummaryBoxDeviceType('weight')
          break
      }
    } catch (error) {
      this.setSummaryBoxDeviceType('weight')
    }
  }

  private setSummaryBoxDeviceType(deviceType: string) {
    this.summaryBoxDeviceType = deviceType
    this.bus.trigger(
      'summary-boxes.device-type.change',
      deviceTypes[deviceType]
    )
  }

  private async fetchCareManagementBillingSnapshot(serviceType: string) {
    return this.database.fetchCareManagementBillingSnapshot({
      account: this.context.accountId,
      organization: this.context.organizationId,
      limit: 1,
      offset: 0,
      status: 'all',
      serviceType
    })
  }
}
