import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { MessageAddMemberDialog, PromptDialog } from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import { MatDialog } from '@coachcare/material'
import { AccountTypeIds, Messaging } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { filter } from 'rxjs/operators'
import { sortBy } from 'lodash'
import {
  MessageRecipient,
  MessagesComponentMode,
  MessageThread
} from '../../model'
import { TranslatePipe } from '@ngx-translate/core'

@Component({
  selector: 'messages-chat-info',
  templateUrl: './chat-info.component.html',
  styleUrls: ['./chat-info.component.scss'],
  host: { class: 'ccr-messages' },
  providers: [TranslatePipe]
})
export class MessagesChatInfoComponent implements OnInit {
  @Input() mode: MessagesComponentMode = 'main'
  @Input() thread: MessageThread

  @Output() hideChatInfo: EventEmitter<void> = new EventEmitter<void>()

  public currentUser
  public isProvider = false

  constructor(
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private messaging: Messaging,
    private notifier: NotifierService,
    private translatePipe: TranslatePipe
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.context.user
    this.isProvider =
      this.context.user.accountType.id === AccountTypeIds.Provider
  }

  public onHideChatInfo(): void {
    this.hideChatInfo.emit()
  }

  public onRemoveUser(user: MessageRecipient): void {
    const shouldShowSelfPatientWarning =
      this.mode === 'patient-profile' && user.id === this.context.accountId
    const secondaryWarningText = shouldShowSelfPatientWarning
      ? this.translatePipe.transform(
          _('BOARD.THREAD_REMOVE_SELF_PATIENT_DESCRIPTION'),
          { user }
        )
      : ''

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.THREAD_REMOVE_MEMBER_TITLE'),
          content: `${this.translatePipe.transform(
            _('BOARD.THREAD_REMOVE_MEMBER_DESCRIPTION'),
            { user }
          )}${secondaryWarningText}`,
          yes: _('BOARD.THREAD_REMOVE_MEMBER_TITLE'),
          no: _('GLOBAL.CANCEL')
        },
        width:
          this.deviceDetector.isTablet() || this.deviceDetector.isDesktop()
            ? '60vw'
            : undefined
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(async () => {
        try {
          await this.messaging.updateAccountThreadAssociation({
            threadId: this.thread.threadId,
            account: user.id,
            isActive: false
          })

          this.thread.allRecipients = this.thread.allRecipients.filter(
            (recipient) => recipient.id !== user.id
          )
          this.thread.recipients = this.thread.recipients.filter(
            (recipient) => recipient.id !== user.id
          )

          this.notifier.success(_('NOTIFY.SUCCESS.USER_REMOVED_THREAD'))
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }

  public openAddMemberDialog(): void {
    this.dialog
      .open(MessageAddMemberDialog, {
        data: { thread: this.thread },
        width:
          this.deviceDetector.isTablet() || this.deviceDetector.isDesktop()
            ? '60vw'
            : undefined
      })
      .afterClosed()
      .pipe(filter((addedAccount) => addedAccount))
      .subscribe((addedAccount) => {
        const newAllRecipients = this.thread.allRecipients.slice()
        newAllRecipients.push(addedAccount)

        const newRecipients = this.thread.recipients.slice()
        newRecipients.push(addedAccount)

        this.thread.allRecipients = sortBy(
          newAllRecipients,
          [(acc) => acc.name.toLowerCase()],
          ['asc']
        )
        this.thread.recipients = sortBy(
          newRecipients,
          [(acc) => acc.name.toLowerCase()],
          ['asc']
        )
      })
  }
}
