import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import { DataPointTypes, MeasurementDataPointType } from '@coachcare/sdk'

export enum Timeframe {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year'
}

export enum Tab {
  LIST = 'list',
  GRAPH = 'graph'
}

export interface BaseData {
  accountId?: string
  token: string
  dataPointTypeId: string
  lastDate?: string
  locale: string
  timezone: string
  timeframe: Timeframe
  metric: UserMeasurementPreferenceType
  view: Tab
  colors: {
    primary: string
    accent: string
    text: string
  }
  dataPointTypes: MeasurementDataPointType[]
  sourceId?: string
  isWeightRequired?: boolean
  orgId?: string
}

export const baseData: BaseData = {
  dataPointTypeId: '',
  accountId: '299',
  token: '',
  locale: 'en',
  timezone: 'America/Chicago',
  timeframe: Timeframe.MONTH,
  metric: 'us',
  view: Tab.LIST,
  colors: {
    primary: '#f05d5c',
    accent: '#f8b1b1',
    text: '#484848'
  },
  dataPointTypes: []
}

export interface Modal {
  title: string
  content: string
  full?: boolean
}

export const requiredWeightIds: string[] = [
  DataPointTypes.BODY_FAT_PERCENTAGE,
  DataPointTypes.LEAN_MASS_PERCENT
]
