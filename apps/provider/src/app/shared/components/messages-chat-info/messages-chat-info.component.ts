import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { MessageAddMemberDialog, PromptDialog } from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import { MatDialog } from '@coachcare/material'
import { Messaging } from '@coachcare/sdk'
import { DeviceDetectorService } from 'ngx-device-detector'
import { MessageThread } from '../messages/messages.interfaces'
import { filter } from 'rxjs/operators'
import { sortBy } from 'lodash'

@Component({
  selector: 'ccr-messages-chat-info',
  templateUrl: './messages-chat-info.component.html',
  styleUrls: ['./messages-chat-info.component.scss'],
  host: { class: 'ccr-messages' }
})
export class CcrMessagesChatInfoComponent implements OnInit {
  @Input() thread: MessageThread

  @Output() hideChatInfo: EventEmitter<void> = new EventEmitter<void>()

  public currentUser

  constructor(
    private context: ContextService,
    private deviceDetector: DeviceDetectorService,
    private dialog: MatDialog,
    private messaging: Messaging,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.currentUser = this.context.user
  }

  public onHideChatInfo(): void {
    this.hideChatInfo.emit()
  }

  public onRemoveUser(user): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.THREAD_REMOVE_MEMBER_TITLE'),
          content: _('BOARD.THREAD_REMOVE_MEMBER_DESCRIPTION'),
          contentParams: { user },
          yes: _('BOARD.THREAD_REMOVE_MEMBER_TITLE'),
          no: _('GLOBAL.CANCEL')
        },
        width:
          this.deviceDetector.isTablet() || this.deviceDetector.isDesktop()
            ? '60vw'
            : undefined
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (!confirm) {
            return
          }

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
