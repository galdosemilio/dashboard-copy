import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { MatSelect, MatSelectChange } from '@coachcare/material'
import { DataPointTypes, DieterDashboardSummary } from '@coachcare/sdk'
import {
  ContextService,
  EventsService,
  MeasurementLabelService,
  NotifierService
} from '@app/service'
import { _ } from '@app/shared'
import { TypeGroupEntry } from '@app/shared/components/chart-v2'
import { resolveConfig } from '@app/config/section'

@Component({
  selector: 'app-dieter-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DieterDashboardComponent implements OnInit, OnDestroy {
  public activityLevels = [
    { value: -1, viewValue: _('SELECTOR.LEVEL.NONE') },
    { value: 0, viewValue: _('SELECTOR.LEVEL.SEDENTARY') },
    { value: 2, viewValue: _('SELECTOR.LEVEL.LOW') },
    { value: 4, viewValue: _('SELECTOR.LEVEL.MEDIUM') },
    { value: 7, viewValue: _('SELECTOR.LEVEL.HIGH') },
    { value: 10, viewValue: _('SELECTOR.LEVEL.INTENSE') }
  ]
  public typeGroups?: TypeGroupEntry[]
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/articles/360018829432-Viewing-the-Patient-Dashboard'

  @ViewChild(MatSelect, { static: false })
  activitySelector: MatSelect

  constructor(
    public data: DieterDashboardSummary,
    private bus: EventsService,
    private context: ContextService,
    private measurementLabel: MeasurementLabelService,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    void this.resolveTypeGroups()

    // default level is low
    void this.data.init(this.context.accountId)

    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  public ngOnDestroy(): void {
    this.bus.trigger('right-panel.component.set', '')
  }

  public setupActivityLevel(): void {
    if (this.data.haveBMRData) {
      this.activitySelector.open()
    }
  }

  public selectActivityLevel(event: MatSelectChange): void {
    this.data.update(event.value === -1 ? null : event.value)
  }

  private async resolveTypeGroups(): Promise<void> {
    try {
      const labels = await this.measurementLabel.fetchMeasurementLabels()
      let dataPointTypes = await this.measurementLabel.fetchDataPointTypes()
      const allowedDataPointTypes: DataPointTypes[] =
        resolveConfig(
          'PATIENT_DASHBOARD.ALLOWED_CHART_DATA_POINT_TYPES',
          this.context.organization
        ) ?? []

      if (allowedDataPointTypes?.length > 0) {
        dataPointTypes = dataPointTypes.filter((dpT) =>
          allowedDataPointTypes.includes(dpT.type.id as DataPointTypes)
        )
      }

      this.typeGroups = labels
        .map((label) => ({
          id: label.id,
          name: label.name,
          types: dataPointTypes
            .filter((typeEntry) => typeEntry.label.id === label.id)
            .map((typeEntry) => typeEntry.type)
        }))
        .filter((typeGroup) => typeGroup.types.length > 0)
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
