import { Component, Inject, OnInit } from '@angular/core'
import { NotifierService } from '@app/service'
import { MessageThread } from '@app/shared/components'
import { AccountTypes } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import { MatDialogRef, MAT_DIALOG_DATA } from '@coachcare/material'
import { Messaging } from '@coachcare/sdk'

interface MessageAddMemberDialogProps {
  thread: MessageThread
}

@Component({
  selector: 'ccr-message-add-member-dialog',
  templateUrl: './message-add-member.dialog.html',
  styleUrls: ['./message-add-member.dialog.scss'],
  host: { class: 'ccr-dialog' }
})
export class MessageAddMemberDialog implements OnInit {
  public existingAccounts = []
  public selectedAccount
  public shownAccountType?: string

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: MessageAddMemberDialogProps,
    private dialogRef: MatDialogRef<MessageAddMemberDialog>,
    private messaging: Messaging,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.existingAccounts = this.data.thread.allRecipients ?? []
  }

  public async onAddToThread(): Promise<void> {
    try {
      await this.messaging.addThreadPermission({
        accounts: [this.selectedAccount.id],
        threadId: this.data.thread.threadId
      })

      this.notifier.success(_('NOTIFY.SUCCESS.USER_ADDED_THREAD'))

      this.dialogRef.close(this.selectedAccount)
    } catch (error) {
      this.notifier.error(error)
    }
  }

  public onSelectAccount(acc) {
    if (!acc || acc.isTrusted !== undefined) {
      return
    }

    const foundAccType = Object.values(AccountTypes).find(
      (accType) => accType.id === acc.accountType.id
    )
    this.selectedAccount = { ...acc, name: `${acc.firstName} ${acc.lastName}` }
    this.shownAccountType =
      foundAccType?.displayName ?? foundAccType?.title ?? acc.accountType.title
  }
}
