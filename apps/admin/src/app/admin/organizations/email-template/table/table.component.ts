import { Component, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@coachcare/layout';
import { EmailTemplatesDataSource } from '@coachcare/backend/data';
import { _ } from '@coachcare/backend/shared';
import { PromptDialog, PromptDialogData } from '@coachcare/common/dialogs/core';
import { NotifierService } from '@coachcare/common/services';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Organization } from 'selvera-api';
import { EmailTemplate } from 'selvera-api/dist/lib/selvera-api/providers/organization/entities';
import { EmailTemplateDialogComponent } from '../dialogs';

@Component({
  selector: 'ccr-organizations-email-template-table',
  templateUrl: './table.component.html'
})
export class EmailTemplateTableComponent implements OnDestroy {
  @Input() orgId: string;
  @Input() source: EmailTemplatesDataSource;

  columns: string[] = ['locale', 'operation', 'category', 'actions'];

  constructor(
    private dialog: MatDialog,
    private notify: NotifierService,
    private organization: Organization
  ) {}

  ngOnDestroy(): void {}

  onDelete(template: EmailTemplate): void {
    try {
      const data: PromptDialogData = {
        title: _('PROMPT.EMAIL_TEMPLATE.DELETE'),
        content: _('PROMPT.EMAIL_TEMPLATE.DELETE_PROMPT')
      };
      this.dialog
        .open(PromptDialog, { data: data })
        .afterClosed()
        .pipe(untilDestroyed(this))
        .subscribe(async confirm => {
          if (confirm) {
            await this.organization.deleteEmailTemplate(template.id);
            this.source.refresh();
          }
        });
    } catch (error) {
      this.notify.error(error);
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
      .pipe(untilDestroyed(this))
      .subscribe(refresh => {
        if (refresh) {
          this.source.refresh();
        }
      });
  }
}
