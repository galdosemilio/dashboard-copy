import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'
import { MeasurementDataPointType } from '@coachcare/sdk'

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
