import { Injectable } from '@angular/core'
import { ContextService } from '@app/service/context.service'
import { CcrDatabase, FormSubmission } from '@app/shared/model'
import {
  Entity,
  FormSubmissionSegment,
  FormSubmissionSingle,
  GetAllFormSubmissionRequest,
  GetAllFormSubmissionResponse,
  FormSubmission as SelveraFormSubmissionService
} from '@coachcare/sdk'
import { from, Observable } from 'rxjs'

@Injectable()
export class FormSubmissionsDatabase extends CcrDatabase {
  constructor(
    private context: ContextService,
    private formSubmission: SelveraFormSubmissionService
  ) {
    super()
  }

  fetch(
    args: GetAllFormSubmissionRequest
  ): Observable<GetAllFormSubmissionResponse> {
    return from(
      new Promise<GetAllFormSubmissionResponse>(async (resolve, reject) => {
        try {
          const response = await this.formSubmission.getAll(args)
          const parsedData: FormSubmission[] = []

          while (response.data.length) {
            const submission: FormSubmissionSegment = response.data.shift()

            parsedData.push(
              new FormSubmission({
                ...submission,
                isAdmin: await this.context.orgHasPerm(
                  submission.organization.id,
                  'admin'
                )
              })
            )
          }

          resolve({ ...response, data: parsedData })
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  fetchAnswers(args: Entity): Observable<FormSubmissionSingle> {
    return from(this.formSubmission.getSingle(args))
  }

  removeSubmission(args: Entity): Observable<void> {
    return from(this.formSubmission.delete(args))
  }
}
