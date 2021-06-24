export enum EventType {
  DATA_POINT_CHANGED = 'DATA_POINT_CHANGED'
}

export type DataPointChangedEvent = {
  type: EventType.DATA_POINT_CHANGED
  dataPointTypeId: string
}

export type Event = DataPointChangedEvent
