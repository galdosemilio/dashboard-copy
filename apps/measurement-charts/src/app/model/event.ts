import { MeasurementDataPointAggregate } from '@coachcare/sdk'

export enum EventType {
  DATA_POINT_CHANGED = 'DATA_POINT_CHANGED'
}

export type DataPointChangedEvent = {
  type: EventType.DATA_POINT_CHANGED
  data: MeasurementDataPointAggregate
}

export type Event = DataPointChangedEvent
