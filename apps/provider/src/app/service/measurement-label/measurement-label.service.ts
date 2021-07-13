import { Injectable } from '@angular/core'
import {
  MeasurementDataPointTypeAssociation,
  MeasurementDataPointTypeProvider,
  MeasurementLabelEntry,
  MeasurementLabelProvider
} from '@coachcare/sdk'
import { ContextService } from '../context.service'
import { NotifierService } from '../notifier.service'

export interface ExtendedMeasurementLabelEntry extends MeasurementLabelEntry {
  routeLink: string
}

@Injectable()
export class MeasurementLabelService {
  // fetching all available measurement labels caches them
  // this service holds the information about the measurement labels and data point types
  public dataPointTypes: MeasurementDataPointTypeAssociation[] = []
  public measurementLabels: ExtendedMeasurementLabelEntry[] = []

  constructor(
    private context: ContextService,
    private dataPointType: MeasurementDataPointTypeProvider,
    private measurementLabel: MeasurementLabelProvider,
    private notifier: NotifierService
  ) {}

  public init(): void {
    void this.fetchMeasurementLabels()
    void this.fetchDataPointTypes()
  }

  public async fetchDataPointTypes(): Promise<
    MeasurementDataPointTypeAssociation[]
  > {
    try {
      if (this.dataPointTypes.length) {
        return this.dataPointTypes.slice()
      }

      const response = await this.dataPointType.getAssociations({
        limit: 'all',
        status: 'active'
      })

      this.dataPointTypes = response.data

      return this.dataPointTypes.slice()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public async fetchMeasurementLabels(): Promise<
    ExtendedMeasurementLabelEntry[]
  > {
    try {
      if (this.measurementLabels.length) {
        return this.measurementLabels.slice()
      }

      const response = await this.measurementLabel.getAll({
        localeMode: 'matching',
        organization: this.context.organizationId,
        limit: 'all',
        status: 'active'
      })

      this.measurementLabels = response.data.map((label) => ({
        ...label,
        routeLink: encodeURIComponent(
          label.name.replace(/\s/gi, '-').toLowerCase()
        )
      }))
      return this.measurementLabels.slice()
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public markCacheAsStale(): void {
    this.measurementLabels = []
    this.dataPointTypes = []
  }

  public async resolveLabelDataPointTypes(
    label: MeasurementLabelEntry
  ): Promise<MeasurementDataPointTypeAssociation[]> {
    try {
      if (!this.dataPointTypes.length) {
        await this.fetchDataPointTypes()
      }

      return this.dataPointTypes.filter((type) => type.label.id === label.id)
    } catch (error) {
      this.notifier.error(error)
    }
  }
}
