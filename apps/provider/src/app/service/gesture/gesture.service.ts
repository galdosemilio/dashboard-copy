import { Injectable } from '@angular/core'
import { BehaviorSubject, fromEvent, merge, Observable, Subject } from 'rxjs'
import { auditTime, debounceTime, filter } from 'rxjs/operators'

interface GestureServiceInitProps {
  userIdleTimeout: number
}

@Injectable()
export class GestureService {
  public userIdle$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  )

  private userIdleTimeout = 900000
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
    props: GestureServiceInitProps = { userIdleTimeout: 900000 }
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
        debounceTime(this.userIdleTimeout),
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
