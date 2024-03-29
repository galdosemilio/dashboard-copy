import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import {
  ContextService,
  FormSubmissionsDatabase,
  NotifierService
} from '@app/service'
import { _ } from '@app/shared/utils'

@Injectable()
export class FormSubmissionsResolver implements Resolve<boolean> {
  constructor(
    private context: ContextService,
    private database: FormSubmissionsDatabase,
    private notifier: NotifierService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Promise<boolean> {
    return new Promise<boolean>(async (resolve) => {
      try {
        const response = await this.database
          .fetch({
            form: route.params.id,
            organization: this.context.organizationId,
            account: undefined
          })
          .toPromise()

        resolve(response.data.length > 0)
      } catch (error) {
        this.notifier.error(_('NOTIFY.ERROR.FORM_NO_ACCESS_VIEW_SUBMISSION'))
        throw new Error(error)
      }
    })
  }
}
