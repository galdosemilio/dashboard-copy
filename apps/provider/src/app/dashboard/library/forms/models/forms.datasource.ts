import { Directive, OnDestroy } from '@angular/core'
import { MatPaginator } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import { ContextService, FormsDatabase, NotifierService } from '@app/service'
import { _ } from '@app/shared/utils'
import {
  TableDataSource,
  Form,
  FormQuestion,
  FormSection
} from '@app/shared/model'
import {
  CreateFormRequest,
  CreateFormSubmissionRequest,
  Entity,
  FormQuestionSingle,
  FormSectionSingle,
  FormSingle,
  GetAllFormRequest,
  GetAllFormResponse,
  GetSingleFormRequest,
  UpdateFormRequest
} from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@UntilDestroy()
@Directive()
export class FormsDatasource
  extends TableDataSource<Form, GetAllFormResponse, GetAllFormRequest>
  implements OnDestroy
{
  notesFormId: string
  showEmpty = _('NOTIFY.SOURCE.NO_FORMS_AVAILABLE')

  constructor(
    private context: ContextService,
    protected database: FormsDatabase,
    protected notify: NotifierService,
    private paginator?: MatPaginator
  ) {
    super()

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.notesFormId = resolveConfig(
          'RIGHT_PANEL.REMINDERS_FORM',
          organization
        )
        this.notesFormId =
          typeof this.notesFormId !== 'object' ? this.notesFormId : undefined
      })

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize || this.pageSize,
        offset:
          (this.paginator.pageIndex !== undefined
            ? this.paginator.pageIndex
            : this.pageIndex) *
          (this.paginator.pageSize !== undefined
            ? this.paginator.pageSize
            : this.pageSize)
      }))
    }
  }

  ngOnDestroy(): void {}

  createForm(args: CreateFormRequest): Promise<Form> {
    const opts: any = { organization: this.context.organization.id }
    return this.execRequest(
      this.database
        .createForm(args)
        .pipe(map((form: FormSingle) => new Form(form, opts)))
        .toPromise()
    )
  }

  createFormQuestion(args: FormQuestion): Promise<FormQuestion> {
    return this.execRequest(
      this.database
        .createFormQuestion({ ...args, description: args.description?.trim() })
        .pipe(
          map(
            (formQuestion: FormQuestionSingle) => new FormQuestion(formQuestion)
          )
        )
        .toPromise()
    )
  }

  createFormSection(args: FormSection): Promise<FormSection> {
    return this.execRequest(
      this.database
        .createFormSection({ ...args, description: args.description?.trim() })
        .pipe(map((formSection: FormSectionSingle) => formSection))
        .toPromise()
    )
  }

  createFormSubmission(args: CreateFormSubmissionRequest): Promise<Entity> {
    return this.execRequest(
      this.database
        .createFormSubmission({
          ...args,
          organization: args.organization ?? this.context.organizationId
        })
        .toPromise()
    )
  }

  updateForm(args: UpdateFormRequest): Promise<Form> {
    const opts: any = { organization: this.context.organization.id }
    return this.execRequest(
      this.database
        .updateForm(args)
        .pipe(map((form: FormSingle) => new Form(form, opts)))
        .toPromise()
    )
  }

  updateFormQuestion(args: FormQuestion): Promise<FormQuestion> {
    return this.execRequest(
      this.database
        .updateFormQuestion({ ...args, description: args.description?.trim() })
        .pipe(
          map(
            (formQuestion: FormQuestionSingle) => new FormQuestion(formQuestion)
          )
        )
        .toPromise()
    )
  }

  updateFormSection(args: FormSection): Promise<FormSection> {
    return this.execRequest(
      this.database
        .updateFormSection({ ...args, description: args.description?.trim() })
        .pipe(map((formSection: FormSectionSingle) => formSection))
        .toPromise()
    )
  }

  deleteForm(args: Form): Promise<void> {
    return this.execRequest(
      this.database.deleteForm({ id: args.id }).toPromise()
    )
  }

  deleteFormQuestion(args: FormQuestion): Promise<void> {
    return this.execRequest(
      this.database.deleteFormQuestion({ id: args.id }).toPromise()
    )
  }

  deleteFormSection(args: FormSection): Promise<void> {
    return this.execRequest(
      this.database.deleteFormSection({ id: args.id }).toPromise()
    )
  }

  defaultFetch(): GetAllFormResponse {
    return { data: [], pagination: {} }
  }

  fetch(args: GetAllFormRequest): Observable<GetAllFormResponse> {
    return this.database.fetch(args)
  }

  mapResult(response: GetAllFormResponse): Form[] {
    this.getTotal(response as any)

    return (
      this.notesFormId
        ? response.data.filter((form) => form.id !== this.notesFormId)
        : response.data
    ) as Form[]
  }

  readForm(args: GetSingleFormRequest): Promise<Form> {
    const opts: any = {
      organization: this.context.organization.id,
      inServer: true
    }
    return this.execRequest(
      this.database
        .readForm(args)
        .pipe(map((form: FormSingle) => new Form(form, opts)))
        .toPromise()
    )
  }

  private execRequest(promise: Promise<any>): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.isLoading = true
      this.change$.next()

      try {
        const response = await promise
        resolve(response)
      } catch (error) {
        this.notify.error(error)
        reject(error)
      } finally {
        this.isLoading = false
        this.change$.next()
      }
    })
  }
}
