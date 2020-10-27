import {
  AfterContentInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfigService,
  ContextService,
  EventsService,
  NotifierService
} from '@app/service';
import { _, MessageRecipient, MessageThread } from '@app/shared';
import {
  AccSingleResponse,
  GetAllMessagingResponse,
  MessagingThreadSegment
} from '@app/shared/selvera-api';
import { findIndex, get, uniqBy } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { BehaviorSubject, fromEvent, of, Subject } from 'rxjs';
import { mergeMap, sampleTime } from 'rxjs/operators';
import { Account } from 'selvera-api';
import { ThreadsDatabase, ThreadsDataSource } from './services';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, AfterContentInit, OnDestroy {
  public accounts: string[];
  public account$ = new Subject<string[]>(); // observable for source
  public active = 0;
  public current: AccSingleResponse;
  public interval: any;
  public messagingEnabled: boolean = false;
  public newThread: MessageThread;
  public pageIndex$ = new BehaviorSubject<number>(0);
  public pageSize: number;
  public source: ThreadsDataSource | null;
  public threads: Array<MessageThread> = [];

  @ViewChild('scroll', { static: true })
  scroll: ElementRef;

  constructor(
    private router: Router,
    private account: Account,
    private database: ThreadsDatabase,
    private config: ConfigService,
    private context: ContextService,
    private bus: EventsService,
    private notifier: NotifierService
  ) {
    this.pageSize = this.config.get('app.limit.threads', 20);
  }

  ngOnInit() {
    // this.bus.trigger('organizations.disable-all');
    this.bus.trigger('right-panel.deactivate');

    // setup the data source
    this.source = new ThreadsDataSource(this.notifier, this.database);
    this.source.showEmpty = () => {
      // check if search Criteria is present and display error
      return _('BOARD.NO_MESSAGES_YET');
    };
    // setup defaults
    this.source.addDefault({ accountsExclusive: false });
    this.source.addRequired(this.account$, () => ({
      accounts: this.accounts
    }));
    this.source.addRequired(this.pageIndex$, () => ({
      offset: this.pageIndex$.getValue() * this.pageSize,
      limit: this.pageSize
    }));

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        this.threads = uniqBy(
          this.threads.concat(res.map(this.formatThread.bind(this))),
          'threadId'
        );
      });

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((organization) => {
      this.messagingEnabled = get(organization, 'preferences.messaging.isActive', false);
    });

    this.current = this.context.user;
    this.selectAccounts();

    this.setRefresh();
  }

  ngAfterContentInit() {
    const lastPosition = { scrolled: 0 };
    fromEvent(this.scroll.nativeElement, 'scroll')
      .pipe(
        untilDestroyed(this),
        sampleTime(300),
        mergeMap((ev: any) => of(this.calculatePoints()))
      )
      .subscribe((pos: any) => this.handleScroll(pos, lastPosition));
  }

  ngOnDestroy() {
    this.source.disconnect();
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setRefresh() {
    if (this.interval) {
      return;
    }

    this.interval = setInterval(() => {
      this.source
        .query({ offset: 0 })
        .pipe(untilDestroyed(this))
        .subscribe((res: GetAllMessagingResponse) => {
          const latest = res.data.length ? res.data[0] : null;
          const first = this.threads.length ? this.threads[0] : null;

          if (
            latest &&
            (latest.threadId !== first.threadId ||
              latest.lastMessage.content !== first.lastMessageSent)
          ) {
            const active =
              first && this.threads[this.active] ? this.threads[this.active] : null;
            const threads = res.data.map(this.formatThread.bind(this)) as MessageThread[];

            this.threads = uniqBy(threads.concat(this.threads), 'threadId');

            this.active = findIndex(this.threads, { threadId: active.threadId });
          }
        });
    }, this.config.get('app.refresh.chat.updateThread', 30000));
  }

  selectAccounts(accounts: MessageRecipient[] = []) {
    // update the source
    this.resetThreads();
    this.source.addDefault({ accountsExclusive: accounts.length ? true : false });
    this.accounts = [this.current.id, ...accounts.map((a) => a.id)];
    this.account$.next(this.accounts);
    // update the ccr-messages component
    this.newThread = {
      recipients: accounts
    };
  }

  formatThread(t: MessagingThreadSegment): MessageThread {
    const accounts = t.account
      .map((acc, i) => ({
        id: acc.id,
        name: `${acc.firstName} ${acc.lastName}`,
        firstName: acc.firstName,
        lastName: acc.lastName,
        accountType: null
      }))
      .filter((a) => a.id !== this.current.id);

    return {
      threadId: t.threadId,
      recipients: accounts,
      lastMessageId: t.lastMessage.id,
      lastMessageDate: t.lastMessage.date,
      lastMessageSent: t.lastMessage.content,
      unread: !t.viewed
    };
  }

  viewedThread(id) {
    this.threads.forEach((v, i, threads) => {
      if (threads[i].threadId === id) {
        threads[i].unread = false;
      }
    });
    this.bus.trigger('system.unread.threads');
  }

  resetThreads() {
    this.threads = [];
    this.active = 0;
    this.pageIndex$.next(0);
  }

  gotoProfile(account: MessageRecipient) {
    if (account.accountType) {
      this.router.navigate([this.context.getProfileRoute(account)]);
    } else {
      this.account
        .getSingle(account.id)
        .then((acc: AccSingleResponse) => {
          this.router.navigate([this.context.getProfileRoute(acc)]);
        })
        .catch((err) => {
          this.notifier.error(err);
        });
    }
  }

  // TODO move to a Directive with Output event
  private calculatePoints() {
    const el = this.scroll.nativeElement;
    return {
      height: el.offsetHeight,
      scrolled: el.scrollTop,
      total: el.scrollHeight
    };
  }

  private handleScroll(position, lastPosition) {
    if (position.height + position.scrolled === position.total) {
      if (!this.source.completed && !this.source.isLoading) {
        // scrolled to the bottom
        this.pageIndex$.next(this.pageIndex$.getValue() + 1);
      }
    }
    lastPosition.scrolled = position.scrolled;
  }
}
