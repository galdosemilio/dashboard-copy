import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@coachcare/common/material';
import { Router } from '@angular/router';
import { FormSubmission } from '@app/dashboard/library/forms/models';
import { FormSubmissionsDatasource } from '@app/dashboard/library/forms/services';
import { NotifierService } from '@app/service';
import { PromptDialog } from '@app/shared';
import { _ } from '@app/shared/utils';

@Component({
  selector: 'app-dieter-forms-table',
  templateUrl: './table.component.html',
})
export class DieterFormsTableComponent {
  @Input()
  source: FormSubmissionsDatasource;

  @Output()
  selectSubmission: EventEmitter<FormSubmission> = new EventEmitter<
    FormSubmission
  >();

  public columns: string[] = [
    'formName',
    'organization',
    'createdAt',
    'createdAtHour',
    'actions',
  ];

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private router: Router
  ) {}

  onGoToProviderProfile(formSubmission: FormSubmission) {
    this.router.navigate([
      '/accounts/coaches/',
      formSubmission.submittedBy.id,
      'profile',
    ]);
  }

  onRemoveSubmission(formSubmission: FormSubmission): void {
    if (!formSubmission.canRemoveSubmission) {
      return;
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.REMOVE_SUBMISSION'),
          content: _('LIBRARY.FORMS.REMOVE_SUBMISSION_DESCRIPTION'),
        },
      })
      .afterClosed()
      .subscribe(async (confirm) => {
        try {
          if (confirm) {
            await this.source.removeSubmission({ id: formSubmission.id });
            this.source.refresh();
          }
        } catch (error) {
          this.notifier.error(error);
        }
      });
  }

  onViewForm(submission: FormSubmission): void {
    this.selectSubmission.emit(submission);
  }
}
