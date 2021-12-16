import {
  convertToReadableFormat,
  convertUnitToPreferenceFormat,
  DataPoint,
  MinimalDataPointType
} from '@coachcare/sdk'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import { DataPointEntry } from '../model'

export function getTooltipFromDataPoint(
  dataPoint: DataPoint<DataPointEntry, MinimalDataPointType>,
  measurementPreference: UserMeasurementPreferenceType,
  lang: string
): string {
  return `${convertToReadableFormat(
    dataPoint.value,
    dataPoint.type,
    measurementPreference
  ).toFixed(1)} ${convertUnitToPreferenceFormat(
    dataPoint.type,
    measurementPreference,
    lang
  )}`
}
