import {
  DataPointKind,
  MeasurementDataPointMinimalType,
  MeasurementDataPointTimestamp
} from '@coachcare/sdk'

export interface DataPointEntry {
  createdAt: MeasurementDataPointTimestamp
  id: string
  kind: DataPointKind
  removedAt?: MeasurementDataPointTimestamp
  type: MeasurementDataPointMinimalType
  value: number
}
