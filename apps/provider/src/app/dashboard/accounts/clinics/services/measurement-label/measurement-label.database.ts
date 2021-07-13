import { Injectable } from '@angular/core'
import { CcrDatabase } from '@app/shared'
import {
  MeasurementDataPointTypeAssociation,
  GetMeasurementDataPointTypeAssociationsRequest,
  MeasurementDataPointTypeProvider,
  MeasurementLabelEntry,
  MeasurementLabelProvider
} from '@coachcare/sdk'
import { groupBy } from 'lodash'

export interface MeasurementLabelsWithTypes extends MeasurementLabelEntry {
  dataPointTypes: MeasurementDataPointTypeAssociation[]
}

@Injectable()
export class MeasurementLabelDatabase extends CcrDatabase {
  constructor(
    private dataPointType: MeasurementDataPointTypeProvider,
    private measurementLabel: MeasurementLabelProvider
  ) {
    super()
  }

  public async fetch(
    request: GetMeasurementDataPointTypeAssociationsRequest
  ): Promise<MeasurementLabelsWithTypes[]> {
    const cleanRequest = { ...request, expandedLabels: undefined }

    const measurementLabels = await this.measurementLabel.getAll({
      organization: request.organization,
      localeMode: 'all',
      limit: 'all'
    })

    const dataPointTypes = await this.dataPointType.getAssociations(
      cleanRequest
    )
    const groupedTypes = groupBy(dataPointTypes.data, (type) => type.label.id)

    return measurementLabels.data.map((label) => ({
      ...label,
      dataPointTypes: groupedTypes[label.id] ?? []
    }))
  }
}
