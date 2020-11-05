import { Inject, Injectable } from '@angular/core'
import { MatDialog } from '@coachcare/common/material'
import { AccountsDatabase } from '@coachcare/backend/data'
import {
  AccountProvider,
  AccountRef,
  GetUserMFAResponse,
  MFA
} from '@coachcare/npm-api'
import { _ } from '@coachcare/backend/shared'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'
import { APP_ENVIRONMENT, AppEnvironment } from '@coachcare/common/shared'

@Injectable()
export class AccountDialogs {
  constructor(
    @Inject(APP_ENVIRONMENT) private environment: AppEnvironment,
    protected dialog: MatDialog,
    protected database: AccountsDatabase,
    protected account: AccountProvider,
    protected mfa: MFA
  ) {}

  activatePrompt(item: AccountRef): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PROMPT.ACCS.CONFIRM_ACTIVATE'),
        content: _('PROMPT.ACCS.CONFIRM_ACTIVATE_PROMPT'),
        contentParams: { item: `${item.firstName} ${item.lastName}` }
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.account
              .setActive({
                id: item.id,
                isActive: true
              })
              .then(resolve)
              .catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  deactivatePrompt(item: AccountRef): Promise<any> {
    return new Promise((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PROMPT.ACCS.CONFIRM_DEACTIVATE'),
        content: _('PROMPT.ACCS.CONFIRM_DEACTIVATE_PROMPT'),
        contentParams: { item: `${item.firstName} ${item.lastName}` }
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.account
              .setActive({
                id: item.id,
                isActive: false
              })
              .then(resolve)
              .catch(reject)
          } else {
            reject()
          }
        })
    })
  }

  deactivateMFA(args: GetUserMFAResponse): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const data: PromptDialogData = {
        title: _('PROMPT.ACCS.DEACTIVATE_MFA'),
        content: _('PROMPT.ACCS.DEACTIVATE_MFA_PROMPT')
      }

      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .subscribe(async (confirm) => {
          try {
            if (confirm) {
              await this.mfa.deleteUserMFA({
                id: args.id,
                organization: this.environment.defaultOrgId
              })
            }
            resolve(confirm)
          } catch (error) {
            reject(error)
          }
        })
    })
  }
}
