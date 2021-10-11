import {
  convertUnitToPreferenceFormat,
  DataPointTypes,
  MeasurementDataPointMinimalType
} from '@coachcare/sdk'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'

export const format = (value: number, dataPointTypeId: string) => {
  switch (dataPointTypeId) {
    case DataPointTypes.STEPS:
      return value.toFixed(0)
    case DataPointTypes.SLEEP:
      const hours = Math.floor(value / 3600)
      const minutes = Math.floor((value % 3600) / 60)
      return `${hours > 9 ? hours : `0${hours}`}:${
        minutes > 9 ? minutes : `0${minutes}`
      }` // convert seconds to HH:mm
    default:
      return value.toFixed(1)
  }
}

export const unit = (
  dataPointType: MeasurementDataPointMinimalType,
  metric: UserMeasurementPreferenceType
) => {
  if (dataPointType.id === DataPointTypes.SLEEP) {
    return ''
  }

  if (!dataPointType.unit) {
    return ''
  }

  return convertUnitToPreferenceFormat(dataPointType, metric)
}
