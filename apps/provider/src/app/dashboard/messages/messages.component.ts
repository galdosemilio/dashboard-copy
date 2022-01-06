import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { Router } from '@angular/router'
import {
  ConfigService,
  ContextService,
  EventsService,
  MessagingService,
  NotifierService
} from '@app/service'
import { _, MessageRecipient, MessageThread, PromptDialog } from '@app/shared'
import { MatDialog } from '@coachcare/material'
import {
  AccountTypeIds,
  AccSingleResponse,
  Messaging,
  MessagingThreadSegment
} from '@coachcare/sdk'
import { findIndex, get, sortBy, uniqBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs'
import { filter, mergeMap, sampleTime, tap } from 'rxjs/operators'
import { AccountProvider } from '@coachcare/sdk'
import { ThreadsDatabase, ThreadsDataSource } from './services'

@UntilDestroy()
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterContentInit, OnDestroy {
  public accounts: string[]
  public account$ = new Subject<string[]>() // observable for source
  public active = 0
  public chatInfoEnabled = false
  public current: AccSingleResponse
  public hasUnreadThreads = false
  public isMarkingAsRead = false
  public isProvider = false
  public messagingEnabled = false
  public newThread: MessageThread
  public pageIndex$ = new BehaviorSubject<number>(0)
  public pageSize: number
  public source: ThreadsDataSource | null
  public threads: Array<MessageThread> = []
  public isMessageOpen = false
  public zendeskLink =
    'https://coachcare.zendesk.com/hc/en-us/sections/360003247792-Messages'

  get showCreateNewMessageButton() {
    return (
      this.current &&
      this.isProvider &&
      this.threads.length === 0 &&
      this.accounts.length > 1 &&
      !this.source?.isLoading
    )
  }

  @ViewChild('scroll', { static: true })
  scroll: ElementRef

  constructor(
    private router: Router,
    private account: AccountProvider,
    private database: ThreadsDatabase,
    private dialog: MatDialog,
    private config: ConfigService,
    private context: ContextService,
    private bus: EventsService,
    private messaging: Messaging,
    private messagingService: MessagingService,
    private notifier: NotifierService
  ) {
    this.pageSize = this.config.get('app.limit.threads', 20)
    this.refreshThreads = this.refreshThreads.bind(this)
    this.formatThread = this.formatThread.bind(this)
  }

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate')

    // setup the data source
    this.source = new ThreadsDataSource(this.notifier, this.database)
    this.source.showEmpty = () => {
      // check if search Criteria is present and display error
      return _('BOARD.NO_MESSAGES_YET')
    }
    // setup defaults
    this.source.addDefault({ accountsExclusive: false })
    this.source.addRequired(this.account$, () => ({
      accounts: this.accounts
    }))
    this.source.addRequired(this.pageIndex$, () => ({
      offset: this.pageIndex$.getValue() * this.pageSize,
      limit: this.pageSize
    }))

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.threads = uniqBy(
          this.threads.concat(res.map(this.formatThread)),
          'threadId'
        )
      })

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.messagingEnabled = get(
          organization,
          'preferences.messaging.isActive',
          false
        )
      })

    this.current = this.context.user
    this.isProvider =
      this.context.user.accountType.id === AccountTypeIds.Provider
    this.selectAccounts()

    this.setRefresh()
    this.resolveUnreadThreads()
  }

  ngAfterContentInit() {
    const lastPosition = { scrolled: 0 }
    fromEvent(this.scroll.nativeElement, 'scroll')
      .pipe(
        untilDestroyed(this),
        sampleTime(300),
        mergeMap((ev: any) => of(this.calculatePoints()))
      )
      .subscribe((pos: any) => this.handleScroll(pos, lastPosition))
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  private setRefresh(): void {
    this.messagingService.unreadCount$
      .pipe(
        untilDestroyed(this),
        tap(() => this.resolveUnreadThreads()),
        filter((unreadResponse) => unreadResponse.unreadThreadsCount > 0)
      )
      .subscribe(() => {
        void this.refreshThreads()
      })
  }

  private async refreshThreads(): Promise<void> {
    try {
      const res = await this.source
        .query({ offset: 0 })
        .pipe(untilDestroyed(this))
        .toPromise()

      const latest = res.data?.[0] ?? null
      const first = this.threads?.[0] ?? null

      if (
        latest?.threadId === first.threadId &&
        latest?.lastMessage.content === first.lastMessageSent
      ) {
        return
      }

      const active =
        first && this.threads[this.active] ? this.threads[this.active] : null
      const threads = res.data.map(this.formatThread) as MessageThread[]

      this.threads = uniqBy(threads.concat(this.threads), 'threadId')

      this.active = findIndex(this.threads, {
        threadId: active.threadId
      })
    } catch (error) {
      this.notifier.error(error)
    }
  }

  selectAccounts(accounts: MessageRecipient[] = []) {
    // update the source
    this.resetThreads()
    this.source.addDefault({
      accountsExclusive: accounts.length ? true : false
    })
    this.accounts = [this.current.id, ...accounts.map((a) => a.id)]
    this.account$.next(this.accounts)
    // update the ccr-messages component
    this.newThread = {
      allRecipients: accounts,
      recipients: accounts
    }
  }

  public showMarkUnreadDialog(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('GLOBAL.MESSAGES_MARK_AS_READ'),
          content: _('GLOBAL.MESSAGES_MARK_AS_READ_DESCRIPTION')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(async () => {
        try {
          this.isMarkingAsRead = true

          await this.messaging.markAllMessagesAsViewed({})

          void this.messagingService.refreshUnreadCount()
          this.threads.forEach((thread) => (thread.unread = false))

          this.isMarkingAsRead = false

          this.notifier.success(_('NOTIFY.SUCCESS.THREADS_MARKED_READ'))
        } catch (error) {
          console.error(error)
          this.notifier.error(error)
        }
      })
  }

  formatThread(t: MessagingThreadSegment): MessageThread {
    const accounts = sortBy(
      t.account.map((acc) => ({
        id: acc.id,
        name: `${acc.firstName} ${acc.lastName}`,
        shortName: `${acc.firstName} ${acc.lastName[0]}.`,
        firstName: acc.firstName,
        lastName: acc.lastName,
        accountType: null
      })),
      [(acc) => acc.name.toLowerCase()],
      ['asc']
    )

    return {
      threadId: t.threadId,
      allRecipients: accounts,
      recipients: accounts.filter((a) => a.id !== this.current.id),
      lastMessageId: t.lastMessage.id,
      lastMessageDate: t.lastMessage.date,
      lastMessageSent: t.lastMessage.content,
      organization: t.organization,
      unread: !t.viewed
    }
  }

  viewedThread(id) {
    this.threads.forEach((v, i, threads) => {
      if (threads[i].threadId === id) {
        threads[i].unread = false
      }
    })
    void this.messagingService.refreshUnreadCount()
  }

  resetThreads() {
    this.threads = []
    this.active = 0
    this.pageIndex$.next(0)
  }

  gotoProfile(account: MessageRecipient) {
    if (account.accountType) {
      void this.router.navigate([this.context.getProfileRoute(account)])
    } else {
      this.account
        .getSingle(account.id)
        .then((acc: AccSingleResponse) => {
          void this.router.navigate([this.context.getProfileRoute(acc)])
        })
        .catch((err) => {
          this.notifier.error(err)
        })
    }
  }

  removeThread(index: number): void {
    const removedThread = this.threads[index]
    this.threads = this.threads.filter(
      (thread) => thread.threadId !== removedThread.threadId
    )
    this.active = 0
  }

  // TODO move to a Directive with Output event

  private calculatePoints() {
    const el = this.scroll.nativeElement
    return {
      height: el.offsetHeight,
      scrolled: el.scrollTop,
      total: el.scrollHeight
    }
  }

  private handleScroll(position, lastPosition) {
    if (position.height + position.scrolled >= position.total - 50) {
      if (!this.source.completed && !this.source.isLoading) {
        // scrolled to the bottom
        this.pageIndex$.next(this.pageIndex$.getValue() + 1)
      }
    }
    lastPosition.scrolled = position.scrolled
  }

  private resolveUnreadThreads(): void {
    const {
      unreadThreadsCount,
      unreadMessagesCount
    } = this.messagingService.unreadCount$.getValue()

    this.hasUnreadThreads = unreadThreadsCount > 0 || unreadMessagesCount > 0
  }
}
