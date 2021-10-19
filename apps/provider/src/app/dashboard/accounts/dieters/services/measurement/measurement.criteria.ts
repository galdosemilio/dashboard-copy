import {
  ActivitySummaryData,
  ActivitySummaryUnit,
  BodySummaryData,
  BodySummaryDataResponseSegment,
  BodySummaryUnit,
  SummaryDataOption as FoodSummaryData,
  SummaryDataResponse as FoodSummaryDataResponseSegment,
  SleepSummaryData,
  SleepSummaryUnit,
  SummaryActivityResponseSegment,
  SummarySleepMeasurementResponseSegment
} from '@coachcare/sdk'

export type MeasurementTimeframe = 'alltime' | 'year' | 'month' | 'week' | 'day'

export type MeasurementSummaryUnit =
  | ActivitySummaryUnit
  | BodySummaryUnit
  | SleepSummaryUnit

export type MeasurementSummaryData =
  | ActivitySummaryData
  | BodySummaryData
  | FoodSummaryData
  | SleepSummaryData
  | 'leanMass'
  | 'date'
  | 'bloodPressureString'
  | 'extracellularWaterToBodyWater'
  | 'totalBodyWater'
  | 'visceralAdiposeTissue'
  | 'visceralFatMass'
  | 'ketones'

export type MeasurementSummarySegment = SummaryActivityResponseSegment &
  BodySummaryDataResponseSegment &
  SummarySleepMeasurementResponseSegment &
  FoodSummaryDataResponseSegment

export type MeasurementAggregation =
  | 'mostRecent'
  | 'oldest'
  | 'average'
  | 'highest'
  | 'lowest'

export interface MeasurementCriteria {
  // common request
  account: string
  aggregation?: { type: MeasurementAggregation; property: string }
  startDate: string
  endDate: string
  max?: number | 'all'
  // fetch
  direction?: 'asc' | 'desc'
  // summary
  data?: Array<MeasurementSummaryData>
  unit?: MeasurementSummaryUnit
  // controls
  timeframe: MeasurementTimeframe
  measurement: MeasurementSummaryData
  useNewEndpoint: boolean
  omitEmptyDays: boolean
  limit?: number | 'all'
  offset?: number
  inferLastEntry?: boolean
  limitEntries?: boolean
}
