import { Component, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { MatDialog } from '@coachcare/material'
import {
  ContextService,
  FormPDFService,
  FormSubmissionsDatasource,
  NotifierService
} from '@app/service'
import { PromptDialog } from '@app/shared/dialogs'
import { FormSubmission } from '@app/shared/model'
import { _, TranslationsObject } from '@app/shared/utils'
import { AccountProvider } from '@coachcare/sdk'
import { filter } from 'rxjs/operators'
@Component({
  selector: 'app-library-form-submissions-table',
  templateUrl: './form-submissions-table.component.html',
  styleUrls: ['./form-submissions-table.component.scss']
})
export class FormSubmissionsTableComponent {
  @Input()
  source: FormSubmissionsDatasource

  public columns: string[] = [
    'submittedBy',
    'name',
    'organization',
    'createdAt',
    'createdAtHour',
    'actions'
  ]

  private i18n: TranslationsObject

  constructor(
    private account: AccountProvider,
    private dialog: MatDialog,
    private context: ContextService,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private router: Router,
    private formPDFService: FormPDFService
  ) {}

  onGoToPatientProfile(formSubmission: FormSubmission) {
    if (formSubmission.account.id !== formSubmission.submittedBy.id) {
      void this.router.navigate([
        '/accounts/patients/',
        formSubmission.account.id,
        'dashboard'
      ])
    }
  }

  async onGoToProviderProfile(formSubmission: FormSubmission) {
    try {
      this.source.isLoading = true
      this.source.change$.next()
      const acc = await this.account.getSingle(formSubmission.submittedBy.id)

      if (acc.id === this.context.user.id) {
        void this.router.navigate(['/profile'])
        return
      }

      const res = await this.account.getList({
        accountType: acc.accountType.id,
        organization: this.context.organizationId,
        query: acc.email
      })
      const account = res.data.find((a) => a.email === acc.email)
      if (account) {
        switch (account.accountType.id) {
          case '2':
            void this.router.navigate([
              '/accounts/coaches/',
              formSubmission.submittedBy.id,
              'profile'
            ])
            break

          case '3':
            void this.router.navigate([
              '/accounts/patients/',
              formSubmission.submittedBy.id,
              'dashboard'
            ])
            break
        }
      } else {
        this.notifier.error(_('NOTIFY.ERROR.ACCOUNT_NO_ACCESS_PERMISSION'))
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.source.isLoading = false
      this.source.change$.next()
    }
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

  onViewForm(formSubmission: FormSubmission): void {
    void this.router.navigate([formSubmission.id], { relativeTo: this.route })
  }

  async onGeneratePDF(formSubmission: FormSubmission): Promise<void> {
    void this.formPDFService.generatePDF(formSubmission)
  }
}
