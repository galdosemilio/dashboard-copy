import { Component, EventEmitter, Input, Output } from '@angular/core'
import { MatDialog } from '@coachcare/material'
import { Router } from '@angular/router'
import {
  FormPDFService,
  FormSubmissionsDatasource,
  NotifierService
} from '@app/service'
import { FormSubmission } from '@app/shared/model'
import { PromptDialog } from '@app/shared/dialogs'
import { _ } from '@app/shared/utils'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'app-library-dieter-submissions-table',
  templateUrl: './table.component.html'
})
export class DieterSubmissionsTableComponent {
  @Input()
  source: FormSubmissionsDatasource

  @Output()
  selectSubmission: EventEmitter<FormSubmission> = new EventEmitter<FormSubmission>()

  public columns: string[] = [
    'formName',
    'organization',
    'createdAt',
    'createdAtHour',
    'actions'
  ]

  constructor(
    private dialog: MatDialog,
    private notifier: NotifierService,
    private router: Router,
    private formPDFService: FormPDFService
  ) {}

  onGoToProviderProfile(formSubmission: FormSubmission) {
    void this.router.navigate([
      '/accounts/coaches/',
      formSubmission.submittedBy.id,
      'profile'
    ])
  }

  onRemoveSubmission(formSubmission: FormSubmission): void {
    if (!formSubmission.canRemoveSubmission) {
      return
    }

    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.REMOVE_SUBMISSION'),
          content: _('LIBRARY.FORMS.REMOVE_SUBMISSION_DESCRIPTION')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(async () => {
        try {
          await this.source.removeSubmission({ id: formSubmission.id })
          this.source.refresh()
        } catch (error) {
          this.notifier.error(error)
        }
      })
  }

  onViewForm(submission: FormSubmission): void {
    this.selectSubmission.emit(submission)
  }

  async onGeneratePDF(submission: FormSubmission): Promise<void> {
    void this.formPDFService.generatePDF(submission)
  }
}
