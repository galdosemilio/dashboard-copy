import { ContextService } from '@app/service'
import { ExpandableTableItem, TableDataSource } from '@app/shared'
import {
  convertToReadableFormat,
  GetMeasurementDataPointTypeAssociationsRequest,
  MeasurementDataPointTypeAssociation,
  MeasurementLabelEntry
} from '@coachcare/sdk'
import { MeasurementPreferenceEntry } from '@coachcare/sdk/dist/lib/providers/measurement/preference'
import { chain } from 'lodash'
import { from, Observable } from 'rxjs'
import {
  MeasurementLabelDatabase,
  MeasurementLabelsWithTypes
} from './measurement-label.database'

export type MeasurementLabelTableEntry =
  | (MeasurementDataPointTypeAssociation &
      ExpandableTableItem<MeasurementDataPointTypeAssociation>)
  | (MeasurementLabelEntry & ExpandableTableItem<MeasurementLabelEntry>)

export interface MeasurementLabelDataSourceCriteria
  extends GetMeasurementDataPointTypeAssociationsRequest {
  expandedLabels?: MeasurementLabelTableEntry[]
}

export class MeasurementLabelDataSource extends TableDataSource<
  MeasurementLabelTableEntry,
  MeasurementLabelsWithTypes[],
  MeasurementLabelDataSourceCriteria
> {
  public inheritsPreference = false
  public measurementPreference: MeasurementPreferenceEntry

  constructor(
    protected database: MeasurementLabelDatabase,
    private context: ContextService
  ) {
    super()
  }

  defaultFetch(): MeasurementLabelsWithTypes[] {
    return []
  }

  fetch(
    criteria: GetMeasurementDataPointTypeAssociationsRequest
  ): Observable<MeasurementLabelsWithTypes[]> {
    return from(this.database.fetch(criteria))
  }

  mapResult(
    result: MeasurementLabelsWithTypes[]
  ): MeasurementLabelTableEntry[] {
    let previousLabelSortOrder = 0
    const filteredResult = this.inheritsPreference
      ? result.filter(
          (entry) =>
            entry.organization.id === this.measurementPreference.organization.id
        )
      : result.filter(
          (entry) => entry.organization.id === this.context.clinic.id
        )
    const expandedLabels = this.criteria.expandedLabels?.slice() ?? []

    this.criteria.expandedLabels = []

    return chain(filteredResult)
      .flatMap((label) => {
        let previousTypeSortOrder = 0
        const labelIsExpanded = expandedLabels.length
          ? expandedLabels.some(
              (expandedLabel) => expandedLabel.id === label.id
            )
          : false

        const groupArray = label.dataPointTypes.map((item) => {
          const currentTypeSortOrder =
            item.sortOrder ?? previousTypeSortOrder + 1
          previousTypeSortOrder = currentTypeSortOrder

          return {
            ...item,
            sortOrder: currentTypeSortOrder,
            parsedBounds: {
              lower: convertToReadableFormat(
                item.type.bound.lower,
                item.type,
                this.context.user.measurementPreference
              ).toFixed(),
              upper: convertToReadableFormat(
                item.type.bound.upper,
                item.type,
                this.context.user.measurementPreference
              ).toFixed()
            },
            isEmpty: true,
            isExpanded: false,
            isHidden: !labelIsExpanded,
            level: 1
          }
        })

        const currentLabelSortOrder =
          label.sortOrder ?? previousLabelSortOrder + 1
        previousLabelSortOrder = currentLabelSortOrder

        return [
          {
            ...label,
            sortOrder: currentLabelSortOrder,
            isEmpty: groupArray.length === 0,
            isExpanded: labelIsExpanded,
            isHidden: false,
            level: 0,
            children: groupArray as ExpandableTableItem<MeasurementDataPointTypeAssociation>[]
          },
          ...groupArray
        ]
      })
      .value()
  }
}
