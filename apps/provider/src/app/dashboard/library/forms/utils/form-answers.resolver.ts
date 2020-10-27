import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { FormSubmissionsDatabase } from '@app/dashboard/library/forms/services';
import { NotifierService } from '@app/service';
import { _ } from '@app/shared';
import { FormSubmissionSingle } from '@app/shared/selvera-api';

@Injectable()
export class FormAnswersResolver implements Resolve<FormSubmissionSingle> {
  constructor(
    private database: FormSubmissionsDatabase,
    private notifier: NotifierService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<FormSubmissionSingle> {
    try {
      return await this.database
        .fetchAnswers({ id: route.params.submissionId })
        .toPromise();
    } catch (error) {
      this.notifier.error(_('NOTIFY.ERROR.FORM_NO_ACCESS_VIEW_SUBMISSION'));
      throw new Error(error);
    }
  }
}
