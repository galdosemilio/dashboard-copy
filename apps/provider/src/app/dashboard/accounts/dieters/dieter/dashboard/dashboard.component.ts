import { Component, OnDestroy, OnInit } from '@angular/core'
import { DataPointTypes } from '@coachcare/sdk'
import { ContextService, EventsService, NotifierService } from '@app/service'
import { TypeGroupEntry } from '@app/shared/components/chart-v2'
import { resolveConfig } from '@app/config/section'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Store } from '@ngrx/store'
import { AppState } from '@app/store/state'
import {
  MeasLabelFeatureState,
  measurementLabelSelector
} from '@app/store/measurement-label'

@UntilDestroy()
@Component({
  selector: 'app-dieter-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DieterDashboardComponent implements OnInit, OnDestroy {
  public typeGroups?: TypeGroupEntry[]

  constructor(
    private bus: EventsService,
    private context: ContextService,
    private notifier: NotifierService,
    private store: Store<AppState>
  ) {
    this.resolveTypeGroups = this.resolveTypeGroups.bind(this)
  }

  public ngOnInit(): void {
    this.store
      .select(measurementLabelSelector)
      .pipe(untilDestroyed(this))
      .subscribe(this.resolveTypeGroups)

    this.bus.trigger('right-panel.component.set', 'reminders')
  }

  public ngOnDestroy(): void {
    this.bus.trigger('right-panel.component.set', '')
  }

  private async resolveTypeGroups(state: MeasLabelFeatureState): Promise<void> {
    try {
      const labels = state.measurementLabels
      let dataPointTypes = state.dataPointTypes

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
