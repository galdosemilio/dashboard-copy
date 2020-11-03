import { FormSubmission } from '@app/dashboard/library/forms/models'
import { FormSubmissionsDatabase } from '@app/dashboard/library/forms/services/form-submissions.database'
import { _, CcrPaginator, TableDataSource } from '@app/shared'
import {
  Entity,
  FormSubmissionSegment,
  GetAllFormSubmissionRequest,
  GetAllFormSubmissionResponse
} from '@app/shared/selvera-api'
import { Observable } from 'rxjs'

export class FormSubmissionsDatasource extends TableDataSource<
  FormSubmission,
  GetAllFormSubmissionResponse,
  GetAllFormSubmissionRequest
> {
  showEmpty = _('NOTIFY.SOURCE.NO_FORM_SUBMISSIONS_YET')
  next = 0

  constructor(
    protected database: FormSubmissionsDatabase,
    private paginator?: CcrPaginator
  ) {
    super()
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex || this.pageIndex) *
          (this.paginator.pageSize || this.pageSize)
      }))
    }
  }

  defaultFetch(): GetAllFormSubmissionResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    args: GetAllFormSubmissionRequest
  ): Observable<GetAllFormSubmissionResponse> {
    return this.database.fetch(args)
  }

  mapResult(response: GetAllFormSubmissionResponse): Promise<FormSubmission[]> {
    this.total = response.pagination.next
      ? response.pagination.next + 1
      : this.criteria.offset + response.data.length

    this.next = response.pagination.next || 0
    return Promise.all(
      response.data.map(
        async (submission: FormSubmissionSegment) =>
          submission as FormSubmission
      )
    )
  }

  removeSubmission(args: Entity): Promise<void> {
    return this.execRequest(this.database.removeSubmission(args).toPromise())
  }

  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true
      this.change$.next()

      try {
        const response = await promise
        resolve(response)
      } catch (error) {
        reject(error)
      } finally {
        this.isLoading = false
        this.change$.next()
      }
    })
  }
}
