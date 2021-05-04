import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, Resolve } from '@angular/router'
import { map } from 'rxjs/operators'

import { Form } from '@app/dashboard/library/forms/models'
import { FormsDatabase } from '@app/dashboard/library/forms/services'
import { ContextService } from '@app/service'
import { FormSingle } from '@coachcare/sdk'

@Injectable()
export class FormResolver implements Resolve<Form> {
  constructor(
    private context: ContextService,
    private database: FormsDatabase
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<Form> {
    const opts: any = {
      organization: this.context.organization.id,
      inServer: true
    }

    const response: Form = await this.database
      .readForm({ id: route.params.id, full: true })
      .pipe(map((form: FormSingle) => new Form(form, opts)))
      .toPromise()

    return response
  }
}
