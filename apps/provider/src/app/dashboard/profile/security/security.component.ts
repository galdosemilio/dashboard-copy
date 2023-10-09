import { Component, OnDestroy } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Access } from '@coachcare/sdk'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'app-profile-security',
  templateUrl: './security.component.html'
})
export class SecurityComponent implements OnDestroy {
  public isLoading: boolean

  constructor(
    private access: Access,
    private context: ContextService,
    private dialog: MatDialog,
    private notifier: NotifierService
  ) {}

  ngOnDestroy(): void {}

  resetPassword() {
    const account = this.context.user

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('BOARD.SEND_PASSWORD_RESET'),
          content: _('BOARD.SEND_PASSWORD_RESET_CONTENT'),
          contentParams: {
            email: account.email
          }
        }
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((confirm) => confirm)
      )
      .subscribe(async () => {
        try {
          this.isLoading = true
          await this.access.resetPassword({
            organization: this.context.organizationId,
            email: account.email || ''
          })
          this.notifier.success(_('NOTIFY.SUCCESS.SENT_PASSWORD_RESET_EMAIL'))
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.isLoading = false
        }
      })
  }
}
