import { Injectable } from '@angular/core'
import {
  ApiService,
  GetUnreadMessagingResponse,
  Messaging
} from '@coachcare/sdk'
import { BehaviorSubject, Subject } from 'rxjs'
import { ContextService } from '../context.service'
import { NotifierService } from '../notifier.service'
import { WebSocketNotification } from '../model'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { ConfigService } from '../config.service'
import { auditTime } from 'rxjs/operators'

@UntilDestroy()
@Injectable()
export class MessagingService {
  public newMessage$: Subject<WebSocketNotification> = new Subject<WebSocketNotification>()
  public unreadCount$: BehaviorSubject<GetUnreadMessagingResponse> = new BehaviorSubject<GetUnreadMessagingResponse>(
    {
      unreadMessagesCount: 0,
      unreadThreadIds: [],
      unreadThreadsCount: 0
    }
  )

  private _newMessage$: Subject<WebSocketNotification> = new Subject<WebSocketNotification>()
  private _unreadCount$: Subject<void> = new Subject<void>()

  constructor(
    private api: ApiService,
    private messaging: Messaging,
    private context: ContextService,
    private config: ConfigService,
    private notifier: NotifierService
  ) {
    this.refreshUnreadCount = this.refreshUnreadCount.bind(this)
  }

  public init(): void {
    this.initWebSocket()
    this.initBumpers()
    void this.refreshUnreadCount()
  }

  public async refreshUnreadCount(): Promise<GetUnreadMessagingResponse> {
    try {
      if (this.context.isOrphaned) {
        return
      }

      const unreadResponse = await this.messaging.getUnread()
      this.unreadCount$.next(unreadResponse)
      return unreadResponse
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private initBumpers(): void {
    this._unreadCount$
      .pipe(
        auditTime(this.config.get('app.refresh.chat.updateThread', 30000)),
        untilDestroyed(this)
      )
      .subscribe(this.refreshUnreadCount)

    this._newMessage$
      .pipe(
        auditTime(this.config.get('app.refresh.chat.newMessages', 5000)),
        untilDestroyed(this)
      )
      .subscribe((notif: WebSocketNotification) => this.newMessage$.next(notif))
  }

  private initWebSocket(): void {
    const socket = this.api.getSocketClient()

    socket.on('notification', async (notif: WebSocketNotification) => {
      switch (notif.type) {
        case 'new-message':
          this._newMessage$.next(notif)
          break

        case 'unread-message-count':
          this._unreadCount$.next()
          break
      }
    })
  }
}
