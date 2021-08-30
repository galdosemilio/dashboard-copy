import { baseData, BaseData } from '@chart/model'
import { BehaviorSubject, Observable, Subject } from 'rxjs'
import { filter, map } from 'rxjs/operators'

type EventString =
  | 'graph.timeframe'
  | 'graph.date-range-change'
  | 'graph.date-range'
  | 'graph.date-range-previous'
  | 'graph.date-range-next'
  | 'graph.data'
  | 'graph.sources'
  | 'graph.source-change'
  | 'list.refresh'
  | 'list.no-previous-entries'
  | 'list.most-recent-entry'

interface EventProps {
  name: string
  data: unknown
}

class EventService {
  private event$: Subject<EventProps> = new Subject<EventProps>()

  public baseDataEvent$: BehaviorSubject<BaseData> = new BehaviorSubject<BaseData>(
    baseData
  )

  public listen<T>(name: EventString): Observable<T> {
    return this.event$.pipe(
      filter((props) => props.name === name),
      map((props) => props.data as T)
    )
  }

  public trigger<T>(name: EventString, data?: T): void {
    this.event$.next({ name, data })
  }
}

const eventService = new EventService()

export { eventService }
