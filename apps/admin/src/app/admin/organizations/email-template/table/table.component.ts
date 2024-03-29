import { Component, Input, OnDestroy } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { EmailTemplatesDataSource } from '@coachcare/backend/data'
import { _ } from '@coachcare/backend/shared'
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core'
import { NotifierService } from '@coachcare/common/services'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { EmailTemplate, OrganizationProvider } from '@coachcare/sdk'
import { EmailTemplateDialogComponent } from '../dialogs'
import { filter } from 'rxjs/operators'

@UntilDestroy()
@Component({
  selector: 'ccr-organizations-email-template-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class EmailTemplateTableComponent implements OnDestroy {
  @Input() orgId: string
  @Input() source: EmailTemplatesDataSource

  columns: string[] = [
    'id',
    'organization',
    'locale',
    'operation',
    'category',
    'actions'
  ]

  constructor(
    private dialog: MatDialog,
    private notify: NotifierService,
    private organization: OrganizationProvider
  ) {}

  ngOnDestroy(): void {}

  onDelete(template: EmailTemplate): void {
    try {
      const data: PromptDialogData = {
        title: _('PROMPT.EMAIL_TEMPLATE.DELETE'),
        content: _('PROMPT.EMAIL_TEMPLATE.DELETE_PROMPT')
      }
      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .pipe(
          untilDestroyed(this),
          filter((confirm) => confirm)
        )
        .subscribe(async () => {
          await this.organization.deleteEmailTemplate(template.id)
          this.source.refresh()
        })
    } catch (error) {
      this.notify.error(error)
    }
  }

  onEdit(emailTemplate: EmailTemplate): void {
    this.dialog
      .open(EmailTemplateDialogComponent, {
        data: {
          title: _('GLOBAL.UPDATE_EMAIL_TEMPLATE'),
          emailTemplate: emailTemplate,
          orgId: this.orgId
        },
        width: '60vw'
      })
      .afterClosed()
      .pipe(
        untilDestroyed(this),
        filter((refresh) => refresh)
      )
      .subscribe(() => this.source.refresh())
  }
}
