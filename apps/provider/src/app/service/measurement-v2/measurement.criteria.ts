import {
  SummaryDataOption as FoodSummaryData,
  SummaryDataResponse as FoodSummaryDataResponseSegment
} from '@coachcare/sdk'

export type MeasurementTimeframe =
  | 'alltime'
  | 'year'
  | 'threeMonths'
  | 'sixMonths'
  | 'month'
  | 'week'
  | 'day'

export type MeasurementSummaryUnit = 'day' | 'week' | 'month'

export type MeasurementSummaryData = FoodSummaryData | 'date'

export type MeasurementSummarySegment = FoodSummaryDataResponseSegment

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
