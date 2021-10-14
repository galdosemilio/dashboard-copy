import { Injectable } from '@angular/core'
import { resolveConfig } from '@app/config/section/utils'
import { FormSubmission } from '@coachcare/sdk'
import { environment } from 'apps/provider/src/environments/environment'
import { Subject } from 'rxjs'
import { ContextService } from '../context.service'

@Injectable()
export class MedicalIntakeFormService {
  public showModal$: Subject<void> = new Subject<void>()

  constructor(
    private context: ContextService,
    private formSubmission: FormSubmission
  ) {}

  public init(): Promise<void> {
    if (this.context.isProvider) {
      return
    }

    this.context.organization$.subscribe(async (org) => {
      const shouldShowForm = resolveConfig(
        'PATIENT_DASHBOARD.SHOW_MEDICAL_INTAKE_FORM',
        org
      )

      if (!shouldShowForm) {
        return
      }

      const hasSubmission =
        (
          await this.formSubmission.getAll({
            form: environment.wellcoreMedicalFormId,
            account: this.context.user.id,
            limit: 1,
            organization: org.id
          })
        ).data.length >= 1

      if (hasSubmission) {
        return
      }

      this.showModal$.next()
    })
  }
}
