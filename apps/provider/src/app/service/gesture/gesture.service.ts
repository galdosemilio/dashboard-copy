import { Injectable } from '@angular/core'
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs'
import { auditTime, debounceTime, filter } from 'rxjs/operators'
import moment, { Duration } from 'moment'
interface GestureServiceInitProps {
  userIdleTimeout: Duration
}

@Injectable()
export class GestureService {
  public userIdle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )

  private userIdleTimeout: Duration
  private isPaused = false
  private simpleEvent$: Observable<Event> = new Observable<Event>()
  private userIdleBumper$: Subject<void> = new Subject<void>()

  constructor() {
    this.simpleEvent$ = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'dblclick'),
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll')
    )
  }

  public init(
    props: GestureServiceInitProps = {
      userIdleTimeout: moment.duration(5, 'minutes')
    }
  ): void {
    this.userIdleTimeout = props.userIdleTimeout

    this.simpleEvent$.pipe(auditTime(300)).subscribe(() => {
      this.userIdleBumper$.next()

      if (this.userIdle$.getValue()) {
        this.userIdle$.next(false)
      }
    })

    this.userIdleBumper$
      .pipe(
        debounceTime(this.userIdleTimeout.asMilliseconds()),
        filter(() => !this.isPaused)
      )
      .subscribe(() => this.userIdle$.next(true))

    this.userIdleBumper$.next()
  }

  public pause(): void {
    this.isPaused = true
  }

  public resume(): void {
    this.isPaused = false
    this.userIdleBumper$.next()
  }
}
