import { Component, OnDestroy } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { ContextService, NotifierService } from '@app/service'
import { PromptDialog } from '@app/shared'
import { _ } from '@app/shared/utils'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Access } from '@coachcare/npm-api'

@UntilDestroy()
@Component({
  selector: 'app-profile-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
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
      .pipe(untilDestroyed(this))
      .subscribe(async (confirm: boolean) => {
        try {
          if (confirm) {
            this.isLoading = true
            await this.access.resetPassword({
              organization: this.context.organizationId,
              email: account.email || ''
            })
          }
        } catch (error) {
          this.notifier.error(error)
        } finally {
          this.isLoading = false
        }
      })
  }
}
