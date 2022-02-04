import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'

import { FormSubmissionsDatabase, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import { FormSubmissionSingle } from '@coachcare/sdk'

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
        .toPromise()
    } catch (error) {
      this.notifier.error(_('NOTIFY.ERROR.FORM_NO_ACCESS_VIEW_SUBMISSION'))
      throw new Error(error)
    }
  }
}
