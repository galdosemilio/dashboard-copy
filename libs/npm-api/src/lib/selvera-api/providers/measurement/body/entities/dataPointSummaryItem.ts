import { Entity } from '../../../common/entities'

interface Timeslot {
  utc: string
  local: string
  timezone: string
}

export interface MeasurementDataPointSummaryItemType {
  id: number
  /**
   * Fixed point multiplier of the unit.
   * For example, a multiplier of 1000 and a unit of % means that a value of 44567 is 44.567%
   * */
  multiplier: number
  /** Name of the measurement type */
  name: string
  /** Unit of the measurement */
  unit: string
}

export interface MeasurementDataPoint {
  createdAt: Timeslot
  group: {
    account?: Entity
    createdAt?: Timeslot
    id?: string
    recordedAt?: Timeslot
    source?: any
    externalId?: string
  }
  id: string
  removedAt?: Timeslot
  type: MeasurementDataPointSummaryItemType
  value: number
}

export interface MeasurementDataPointSummaryItem {
  type: MeasurementDataPointSummaryItemType
  first: MeasurementDataPoint
  last: MeasurementDataPoint
  count: number
  change: {
    percentage: number
    value: number
  }
}
