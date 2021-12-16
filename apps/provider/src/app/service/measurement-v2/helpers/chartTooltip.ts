import {
  DataPointKind,
  DataPointLikeEntry,
  MinimalDataPointType
} from '@coachcare/sdk'
import { getTooltipFromDataPoint } from './utils'
import { DataPointEntry } from '../model'
import { SYNTHETIC_DATA_TYPES } from '@app/dashboard/accounts/dieters/models'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'

export function generateChartTooltip(
  entry: DataPointLikeEntry<DataPointEntry, MinimalDataPointType>,
  measurementPreference: UserMeasurementPreferenceType,
  lang: string
): string | string[] {
  if (entry.kind === DataPointKind.Regular) {
    return [getTooltipFromDataPoint(entry, measurementPreference, lang)]
  }

  const knownDataType = SYNTHETIC_DATA_TYPES.find((syntheticDataType) =>
    syntheticDataType.sourceTypeIds.includes(entry.sources[0].type.id)
  )

  if (!knownDataType) {
    return entry.sources
      .map((source) =>
        getTooltipFromDataPoint(source, measurementPreference, lang)
      )
      .join(' / ')
  }

  return knownDataType.sourceTypeIds
    .map((typeId) => {
      const sourceData = entry.sources.find(
        (source) => source.type.id === typeId
      )

      if (!sourceData) {
        return ''
      }

      return getTooltipFromDataPoint(sourceData, measurementPreference, lang)
    })
    .join(' / ')
}
