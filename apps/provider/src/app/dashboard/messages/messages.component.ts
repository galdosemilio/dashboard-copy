import { Component, Input, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import {
  ConfigService,
  ContextService,
  EventsService,
  MessagingService,
  NotifierService
} from '@app/service'
import { _, PromptDialog } from '@app/shared'
import { MatDialog } from '@coachcare/material'
import {
  AccountAccessData,
  AccountTypeIds,
  AccSingleResponse,
  Messaging,
  MessagingThreadSegment
} from '@coachcare/sdk'
import { chain, findIndex, get, isEqual, sortBy, uniqBy } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject, Subject } from 'rxjs'
import { filter, tap } from 'rxjs/operators'
import { AccountProvider } from '@coachcare/sdk'
import { ThreadsDatabase, ThreadsDataSource } from './services'
import {
  MessageRecipient,
  MessagesComponentMode,
  MessageThread,
  SelectMessageThreadEvent
} from './model'

@UntilDestroy()
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  @Input() mode: MessagesComponentMode = 'main'

  public accounts: MessageRecipient[]
  public account$ = new Subject<MessageRecipient[]>() // observable for source
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
      this.accounts.length > 0 &&
      !this.source?.isLoading
    )
  }

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

  public ngOnInit(): void {
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
      accounts: this.resolveAccountIds()
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
        if (this.accounts.length > 0) {
          this.active = this.threads.findIndex((thread) =>
            isEqual(
              sortBy(thread.allRecipients.map((item) => item.id)),
              this.resolveAccountIds()
            )
          )
        } else {
          this.active = 0
        }
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
    this.selectAccounts(
      this.mode === 'patient-profile'
        ? [this.createMessageRecipient(this.context.account)]
        : []
    )

    this.setRefresh()
    this.resolveUnreadThreads()
  }

  public gotoProfile(account: MessageRecipient): void {
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

  public onReachedEndOfList(): void {
    if (!this.source.completed && !this.source.isLoading) {
      // scrolled to the bottom
      this.pageIndex$.next(this.pageIndex$.getValue() + 1)
    }
  }

  public onSelectThread($event: SelectMessageThreadEvent): void {
    this.active = $event.index
    this.isMessageOpen = !this.isMessageOpen
    this.chatInfoEnabled = false
  }

  public removeThread(index: number): void {
    const removedThread = this.threads[index]
    this.threads = this.threads.filter(
      (thread) => thread.threadId !== removedThread.threadId
    )
    this.active = 0
  }

  public resetThreads(): void {
    this.threads = []
    this.active = 0
    this.pageIndex$.next(0)
  }

  public selectAccounts(accounts: MessageRecipient[] = []): void {
    // update the source
    this.resetThreads()
    this.source.addDefault({ accountsInclusive: accounts.length > 0 })
    this.accounts = accounts
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

  public markThreadAsViewed(id: string): void {
    const thread = this.threads.find((thr) => thr.threadId === id)

    if (thread) {
      thread.unread = false
    }

    void this.messagingService.refreshUnreadCount()
  }

  private createMessageRecipient(account: AccountAccessData): MessageRecipient {
    return {
      ...this.context.account,
      name: `${this.context.account.firstName} ${this.context.account.lastName}`,
      shortName: `${account.firstName} ${account.lastName[0]}.`,
      accountType: account.accountType.id
    }
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

  private formatThread(t: MessagingThreadSegment): MessageThread {
    const accounts = chain(t.account)
      .map((acc) => ({
        id: acc.id,
        name: `${acc.firstName} ${acc.lastName}`,
        shortName: `${acc.firstName} ${acc.lastName[0]}.`,
        firstName: acc.firstName,
        lastName: acc.lastName,
        accountType: acc.type?.id
      }))
      .orderBy(
        [(entry) => entry.accountType, (entry) => entry.name],
        ['desc', 'asc']
      )
      .value()

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

  private resolveUnreadThreads(): void {
    const { unreadThreadsCount, unreadMessagesCount } =
      this.messagingService.unreadCount$.getValue()

    this.hasUnreadThreads = unreadThreadsCount > 0 || unreadMessagesCount > 0
  }

  public onCreateNewThread(user: MessageRecipient) {
    this.chatInfoEnabled = false
    this.selectAccounts([user])
  }

  private resolveAccountIds() {
    return sortBy([
      this.current.id,
      ...this.accounts.map((account) => account.id)
    ])
  }
}
