import { Injectable } from '@angular/core'
import {
  Form,
  FormQuestion,
  FormSection
} from '@app/dashboard/library/forms/models'
import { ContextService } from '@app/service'
import { CcrDatabase } from '@app/shared/model/generic.database'
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
import { from, Observable } from 'rxjs'
import {
  Form as FormService,
  FormQuestion as FormQuestionService,
  FormSection as FormSectionService,
  FormSubmission as FormSubmissionService
} from '@coachcare/sdk'

@Injectable()
export class FormsDatabase extends CcrDatabase {
  constructor(
    private context: ContextService,
    private form: FormService,
    private formQuestion: FormQuestionService,
    private formSection: FormSectionService,
    private formSubmission: FormSubmissionService
  ) {
    super()
  }

  createForm(args: CreateFormRequest): Observable<FormSingle> {
    return from(
      new Promise<FormSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.form.create(args)
          const formSingle: FormSingle = await this.form.getSingle(entity)
          resolve(formSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  createFormQuestion(args: FormQuestion): Observable<FormQuestionSingle> {
    return from(
      new Promise<FormQuestionSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.formQuestion.create({
            section: args.section.id,
            questionType: args.questionType.id,
            title: args.title,
            description: args.description || undefined,
            sortOrder: args.sortOrder,
            isRequired: args.isRequired,
            allowedValues: args.allowedValues || undefined
          })
          const formQuestionSingle: FormQuestionSingle = await this.formQuestion.getSingle(
            entity
          )
          resolve(formQuestionSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  createFormSection(args: FormSection): Observable<FormSectionSingle> {
    return from(
      new Promise<FormSectionSingle>(async (resolve, reject) => {
        try {
          const entity: Entity = await this.formSection.create({
            form: args.form.id,
            title: args.title,
            description: args.description || undefined,
            sortOrder: args.sortOrder
          })
          const formSectionSingle: FormSectionSingle = await this.formSection.getSingle(
            entity
          )
          resolve(formSectionSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  createFormSubmission(args: CreateFormSubmissionRequest): Observable<Entity> {
    return from(this.formSubmission.create(args))
  }

  updateForm(args: UpdateFormRequest): Observable<FormSingle> {
    return from(
      new Promise<FormSingle>(async (resolve, reject) => {
        try {
          await this.form.update(args)
          const formSingle: FormSingle = await this.form.getSingle({
            id: args.id
          })
          resolve(formSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  updateFormQuestion(args: FormQuestion): Observable<FormQuestionSingle> {
    return from(
      new Promise<FormQuestionSingle>(async (resolve, reject) => {
        try {
          await this.formQuestion.update({
            allowedValues:
              args.allowedValues && args.allowedValues.length
                ? args.allowedValues
                : null,
            description: args.description || null,
            id: args.id,
            isRequired: args.isRequired,
            questionType: args.questionType.id,
            section: args.section.id,
            sortOrder: args.isMoved ? args.sortOrder : undefined,
            title: args.title
          })
          const formQuestionSingle: FormQuestionSingle = await this.formQuestion.getSingle(
            { id: args.id }
          )
          resolve(formQuestionSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  updateFormSection(args: FormSection): Observable<FormSectionSingle> {
    return from(
      new Promise<FormSectionSingle>(async (resolve, reject) => {
        try {
          await this.formSection.update({
            id: args.id,
            title: args.title,
            description: args.description || null,
            sortOrder:
              args.isMoved || !args.inServer ? args.sortOrder : undefined
          })
          const formSectionSingle: FormSectionSingle = await this.formSection.getSingle(
            {
              id: args.id
            }
          )
          resolve(formSectionSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  deleteForm(args: Entity): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.form.delete(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  deleteFormQuestion(args: Entity): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.formQuestion.delete(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  deleteFormSection(args: Entity): Observable<void> {
    return from(
      new Promise<void>(async (resolve, reject) => {
        try {
          await this.formSection.delete(args)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  readForm(args: GetSingleFormRequest): Observable<FormSingle> {
    return from(
      new Promise<FormSingle>(async (resolve, reject) => {
        try {
          const formSingle: FormSingle = await this.form.getSingle(args)
          resolve(formSingle)
        } catch (error) {
          reject(error)
        }
      })
    )
  }

  fetch(args: GetAllFormRequest): Observable<GetAllFormResponse> {
    return from(
      new Promise<GetAllFormResponse>(async (resolve, reject) => {
        const response: GetAllFormResponse = await this.form.getAll(args)
        const parsedData: any = []

        while (response.data.length) {
          const form: FormSingle = response.data.shift()
          parsedData.push(
            new Form({
              ...form,
              isAdmin: await this.context.orgHasPerm(
                form.organization.id,
                'admin'
              ),
              canFetchSubmissions:
                (await this.context.orgHasPerm(
                  form.organization.id,
                  'allowClientPhi'
                )) &&
                (await this.context.orgHasPerm(form.organization.id, 'viewAll'))
            })
          )
        }

        resolve({ ...response, data: parsedData })
      })
    )
  }
}
