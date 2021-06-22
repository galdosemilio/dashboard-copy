import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import {
  AccSingleResponse,
  AddMessageMessagingRequest,
  CreateThreadMessagingRequest,
  GetAllMessagingRequest,
  GetAllMessagingResponse,
  GetThreadMessagingRequest,
  GetThreadMessagingResponse,
  Messaging
} from '@coachcare/sdk'
import { _ } from '@app/shared/utils'
import { MessagingItem } from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import { first, last, uniqBy } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, merge, Subject } from 'rxjs'
import { auditTime, takeUntil } from 'rxjs/operators'
import { MessageRecipient, MessageThread } from './messages.interfaces'
import { MessageContainer } from '@app/shared/model'
import { STORAGE_MESSAGE_INPUT_HEIGHT } from '@app/config'

type MessagesDraftData = { message?: string; patientMessage?: string }

@UntilDestroy()
@Component({
  selector: 'ccr-messages',
  templateUrl: './messages.component.html',
  host: { class: 'ccr-messages' },
  styleUrls: ['./messages.component.scss']
})
export class CcrMessagesComponent
  implements OnChanges, OnDestroy, OnInit, AfterViewInit {
  @ViewChild('messageBody', { static: false })
  private messageContainer: ElementRef

  @ViewChild('messageFooter', { static: false })
  private messageFooter: ElementRef

  @Input()
  account: AccSingleResponse
  @Input()
  dieterId: string
  @Input()
  mode: 'patient' | 'messages' = 'messages'
  @Input()
  set thread(thread: MessageThread) {
    this.forceDraftSync$.next()
    this._thread = thread
    this.fetchDraft()
    this.shownRecipients = thread.recipients.slice().splice(0, 3)
  }

  get thread(): MessageThread {
    return this._thread
  }

  @Output()
  lastMessageSent = new EventEmitter<string>()
  @Output()
  viewed = new EventEmitter<string>()
  @Output()
  refresh = new EventEmitter<void>()
  @Output()
  gotoProfile = new EventEmitter<MessageRecipient>()
  @Output()
  onBackToUser = new EventEmitter<void>()
  @Output()
  toggleChatInfo = new EventEmitter<void>()

  changed$ = new Subject<void>()
  disabled = false
  loading = false
  offset = 0
  messages: Array<MessageContainer> = []
  newMessage = ''
  public shownRecipients = []

  private _thread?: MessageThread
  private draftAuditTime = 5000
  private draftData: MessagesDraftData = {}
  private draftExists = false
  private forceDraftSync$: Subject<void> = new Subject<void>()
  private onTextInputChange$: Subject<string> = new Subject<string>()
  private threadId: string = null
  private previousScrollHeight = 0
  private timers: any[] = []
  private resizerClientY = 0

  constructor(
    private messaging: Messaging,
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private translate: TranslateService
  ) {
    this.onResize = this.onResize.bind(this)
    this.onResizeEnd = this.onResizeEnd.bind(this)
  }

  public ngOnInit(): void {
    this.translate.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.renderTimestamps()
    })

    merge(
      this.onTextInputChange$.pipe(auditTime(this.draftAuditTime)),
      this.forceDraftSync$
    )
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        const text = this.newMessage

        if (!text) {
          void this.removeDraft()
          return
        }

        void this.saveDraft(text)
      })
  }

  public ngAfterViewInit(): void {
    const messageInputHeight = window.localStorage.getItem(
      STORAGE_MESSAGE_INPUT_HEIGHT
    )

    if (messageInputHeight) {
      this.resizeMessageInput(Number(messageInputHeight))
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.timers[0]) {
      this.timers[0] = clearInterval(this.timers[0])
      this.timers[1] = clearInterval(this.timers[1])
    }
    // reset dieterId based on thread change
    if (
      changes.thread &&
      !changes.thread.firstChange &&
      !changes.thread.currentValue
    ) {
      this.dieterId = null
      this.threadId = null
    }
    // eval if there's something to load
    if (!this.account || (!this.dieterId && !this.thread)) {
      this.disabled = true
      this.messages = []
    } else {
      this.disabled = false
      this.messages = []
      this.offset = 0
      if (this.thread) {
        if (this.thread.threadId) {
          this.threadId = this.thread.threadId
          this.loadMessages()
        } else if (this.thread.recipients.length) {
          this.loadThread()
        } else {
          this.disabled = true
        }
      } else if (this.dieterId) {
        this.loadThread()
      }
    }
  }

  public ngOnDestroy(): void {
    if (this.timers[0]) {
      clearInterval(this.timers[0])
      clearInterval(this.timers[1])
    }

    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.onResizeEnd)
  }

  public onResizeStart(event: MouseEvent) {
    event.preventDefault()

    document.addEventListener('mousemove', this.onResize)
    document.addEventListener('mouseup', this.onResizeEnd)
  }

  public onTextInputChange(text: string) {
    this.onTextInputChange$.next(text)
  }

  public showProfile(account: MessageRecipient): void {
    this.gotoProfile.emit(account)
  }

  public loadPrevious(): void {
    this.loadMessages()
  }

  public onToggleChatInfo(): void {
    this.toggleChatInfo.emit()
  }

  public sendMessage(): void {
    if (!this.newMessage.length) {
      return
    }

    this.loading = true
    if (this.threadId === null) {
      this.createNewThread()
    } else {
      this.addToThread()
      this.removeDraft()
      this.onTextInputChange('')
    }
  }

  private onResize(e: MouseEvent): void {
    e.preventDefault()
    const clientY = e.clientY
    const deltaY = clientY - (this.resizerClientY || clientY)
    this.resizerClientY = clientY

    const height = Math.round(
      parseInt(getComputedStyle(this.messageFooter.nativeElement).height, 10) -
        deltaY
    )

    window.localStorage.setItem(STORAGE_MESSAGE_INPUT_HEIGHT, String(height))

    this.resizeMessageInput(height)
  }

  private onResizeEnd(event: MouseEvent): void {
    event.preventDefault()
    document.removeEventListener('mousemove', this.onResize)
    document.removeEventListener('mouseup', this.onResizeEnd)
    this.resizerClientY = 0
  }

  private resizeMessageInput(height: number): void {
    this.messageFooter.nativeElement.style.flex = `0 ${
      height < 10 ? 0 : height
    }px`
    this.messageContainer.nativeElement.style.flex = '1 0'
  }

  private setRefresh() {
    if (!this.timers[0]) {
      this.timers[0] = setInterval(() => {
        this.renderTimestamps()
      }, this.config.get('app.refresh.chat.updateTimestamps', 20000))

      this.timers[1] = setInterval(() => {
        this.checkNewMessages()
      }, this.config.get('app.refresh.chat.newMessages', 7500))
    }
  }

  private scrollMessagesToBottom(forceToBottom: boolean): void {
    setTimeout(() => {
      try {
        this.messageContainer.nativeElement.scrollTop = forceToBottom
          ? this.messageContainer.nativeElement.scrollHeight
          : this.messageContainer.nativeElement.scrollHeight -
            this.previousScrollHeight
      } catch (err) {
        this.notifier.log('Error scrolling message container', err)
      }
    }, 25)
  }

  private resolveAccounts(): string[] {
    const accounts = this.dieterId
      ? [this.dieterId, this.account.id]
      : [this.account.id, ...this.thread.recipients.map((r) => r.id)]
    return accounts.sort((x, y) => Number(x) - Number(y))
  }

  private loadThread(): void {
    this.changed$.next()

    if (this.disabled) {
      return
    }

    const request: GetAllMessagingRequest = {
      accounts: this.resolveAccounts(),
      accountsExclusive: true
    }

    from(this.messaging.getAll(request))
      .pipe(takeUntil(this.changed$))
      .subscribe((res: GetAllMessagingResponse) => {
        this.threadId = res.data.length > 0 ? res.data[0].threadId : null

        if (!this.thread) {
          this.fetchDraft()
        }

        this.loadMessages()
      })
  }

  private checkNewMessages() {
    if (!this.messages.length) {
      return
    }

    const threadRequest: GetThreadMessagingRequest = {
      threadId: this.threadId,
      offset: 0
    }

    from(this.messaging.getThread(threadRequest))
      .pipe(takeUntil(this.changed$))
      .subscribe((res: GetThreadMessagingResponse) => {
        if (!res.data.length) {
          return
        }
        const latest = first<MessagingItem>(res.data)
        const current = last(this.messages)
        // FIXME as the backend doesn't retrieve the added ID, this is a workaround
        if (
          current.messageId === null &&
          current.content === latest.content &&
          current.author === latest.account.id
        ) {
          current.messageId = latest.messageId
        }
        if (latest && current && latest.messageId !== current.messageId) {
          const newMessages: Array<MessageContainer> = res.data
            .map((m) => new MessageContainer(m))
            .reverse()

          this.messages = uniqBy(
            this.messages
              .filter((m) => m.messageId !== null)
              .concat(newMessages),
            'messageId'
          )

          this.renderTimestamps()
          this.scrollMessagesToBottom(true)
        }
      })
  }

  private async fetchDraft(): Promise<void> {
    try {
      if (!(this.threadId || this.thread?.threadId)) {
        return
      }

      const draft = await this.messaging.getDraft({
        threadId: this.thread?.threadId ?? this.threadId
      })

      this.draftData = draft.data

      this.newMessage =
        this.mode === 'messages'
          ? this.draftData.message ?? ''
          : this.draftData.patientMessage ?? ''

      this.draftExists = true
    } catch (error) {
      this.newMessage = ''
      this.draftExists = false
    }
  }

  private async removeDraft(): Promise<void> {
    if (!this.draftExists) {
      return
    }

    try {
      const threadId = this.thread?.threadId ?? this.threadId

      if (this.mode === 'messages' && this.draftData.patientMessage) {
        await this.messaging.upsertDraft({
          threadId,
          data: { ...this.draftData, message: undefined }
        })
        return
      }

      if (this.mode === 'patient' && this.draftData.message) {
        await this.messaging.upsertDraft({
          threadId,
          data: { ...this.draftData, patientMessage: undefined }
        })
        return
      }

      await this.messaging.deleteDraft({
        threadId
      })

      this.draftExists = false
    } catch (error) {}
  }

  private async saveDraft(text: string): Promise<void> {
    if (!text || !this.threadId) {
      return
    }

    try {
      const payload: MessagesDraftData = {
        message: this.mode === 'messages' ? text : this.draftData.message,
        patientMessage:
          this.mode === 'patient' ? text : this.draftData.patientMessage
      }

      await this.messaging.upsertDraft({
        threadId: this.threadId,
        data: payload
      })
      this.draftExists = true
      this.draftData = payload
    } catch (error) {
      this.notifier.error(error)
    }
  }

  private loadMessages(): void {
    this.changed$.next()

    if (this.threadId === null) {
      this.loading = false
      return
    }

    const threadRequest: GetThreadMessagingRequest = {
      threadId: this.threadId,
      offset: this.offset
    }

    from(this.messaging.getThread(threadRequest))
      .pipe(takeUntil(this.changed$))
      .subscribe(
        (res: GetThreadMessagingResponse) => {
          try {
            this.previousScrollHeight = this.messageContainer.nativeElement.scrollHeight
          } catch (err) {
            this.previousScrollHeight = 0
          }

          const newMessages: Array<MessageContainer> = res.data
            .map((m) => new MessageContainer(m))
            .reverse()

          this.messages = [...newMessages, ...this.messages]
          this.renderTimestamps()
          this.setRefresh()
          if (this.thread && this.thread.unread) {
            this.viewed.emit(this.threadId)
          }
          this.offset = res.pagination.next ? res.pagination.next : 0

          this.loading = false

          this.scrollMessagesToBottom(false)
        },
        () => {
          this.loading = false
        }
      )
  }

  private addToThread(isNew = false): void {
    const request: AddMessageMessagingRequest = {
      threadId: this.threadId,
      subject: 'CoachCare Message',
      content: this.newMessage
    }

    this.messaging.addMessage(request).then(
      () => {
        const message = new MessageContainer({
          threadId: null,
          messageId: null,
          subject: 'CoachCare Message',
          content: this.newMessage,
          createdAt: moment().format(),
          account: {
            id: this.account.id,
            firstName: this.account.firstName,
            lastName: this.account.lastName
          }
        })

        this.messages.push(message)
        this.renderTimestamps()
        this.setRefresh()
        this.newMessage = ''

        this.loading = false

        this.scrollMessagesToBottom(true)
        this.lastMessageSent.emit(message.content)

        if (isNew) {
          this.refresh.emit()
        }
      },
      () => {
        this.loading = false
        this.notifier.error(_('NOTIFY.ERROR.MESSAGE_NOT_SEND'))
      }
    )
  }

  private createNewThread(): void {
    const request: CreateThreadMessagingRequest = {
      subject: 'CoachCare Message',
      organization: this.context.organizationId,
      creatorId: this.account.id,
      accounts: this.resolveAccounts()
    }

    this.messaging.createThread(request).then(
      (res) => {
        this.threadId = res.id
        this.addToThread(true)
      },
      () => {
        this.loading = false
        this.notifier.error(_('NOTIFY.ERROR.THREAD_NOT_CREATED'))
      }
    )
  }

  private renderTimestamps(): void {
    let lastShownTime: moment.Moment = moment('2000-01-01')
    for (const message of this.messages) {
      // Add a timestamp if one doesn't exist, as applicable
      if (moment(message.createdAt).diff(lastShownTime, 'minutes') > 7) {
        message.timestamp =
          moment().diff(message.createdAt, 'days') > 2
            ? moment(message.createdAt).format('dddd, MMM D, YYYY, h:mm a')
            : moment(message.createdAt).fromNow()
        lastShownTime = moment(message.createdAt)
      } else {
        message.timestamp = null
      }
    }
  }

  getTargets() {
    return this.thread.recipients.map((r) => {
      return {
        id: r.id,
        name: `${r.firstName} ${r.lastName[0].toUpperCase()}.`
      }
    })
  }

  backToUserList(): void {
    this.onBackToUser.emit()
  }
}
