import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import {
  AccountAddress,
  AccSingleResponse,
  AddressProvider,
  CreateFormSubmissionRequest,
  Form,
  FormAnswer,
  FormSingle,
  FormSubmission,
  User
} from '@coachcare/sdk'
import { environment } from 'apps/admin/src/environments/environment'
import * as moment from 'moment'

export interface QuestionEntry {
  id: string
  isRequired: boolean
  title: string
  type: string
  /* Only for radio and checkbox questions */
  options?: string[]
}

@Component({
  selector: 'ccr-wellcore-medical-intake-form',
  templateUrl: './medical-intake-form.component.html',
  styleUrls: ['./medical-intake-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WellcoreMedicalIntakeFormComponent implements OnInit {
  public activityQuestions: QuestionEntry[] = []
  public additionalQuestions: QuestionEntry[] = []
  public form: FormGroup
  public formSingle: FormSingle
  public userSingle: AccSingleResponse

  public set isLoading(isLoading: boolean) {
    this._isLoading = isLoading

    if (isLoading) {
      this.form.disable()
    } else {
      this.form.enable()
    }
  }

  public get isLoading(): boolean {
    return this._isLoading
  }

  private _isLoading = false

  constructor(
    private address: AddressProvider,
    private fb: FormBuilder,
    private formProvider: Form,
    private formSubmission: FormSubmission,
    private router: Router,
    private user: User
  ) {}

  public ngOnInit(): void {
    this.createPatientForm()
    void this.fetchPatientInfo()
    void this.fetchMedicalIntakeForm()
  }

  public async onSubmit(): Promise<void> {
    try {
      const formValue = this.form.value

      this.isLoading = true

      const submission: CreateFormSubmissionRequest = {
        form: this.formSingle.id,
        account: this.userSingle.id,
        submittedBy: this.userSingle.id,
        answers: this.formatAnswers(formValue)
      }

      await this.formSubmission.create(submission)

      this.router.navigate(['./wellcore/thank-you'])
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  private createPatientForm(): void {
    this.form = this.fb.group({
      patient: [],
      additionalQuestions: [null, Validators.required],
      activityQuestions: [null, Validators.required]
    })
  }

  private async fetchMedicalIntakeForm(): Promise<void> {
    try {
      const formSingle = await this.formProvider.getSingle({
        id: environment.wellcoreMedicalFormId,
        full: true
      })
      this.formSingle = formSingle
      this.resolveQuestions(formSingle)
    } catch (error) {
      console.error(error)
    }
  }

  private async fetchPatientInfo(): Promise<void> {
    try {
      const user = await this.user.get()
      const addresses = await this.address.getAddressList({ account: user.id })
      this.userSingle = user
      this.loadPatientInfo(user, addresses.data[0] ?? null)
    } catch (error) {
      console.error(error)
    }
  }

  private formatAnswers(formValue): FormAnswer[] {
    const additionalAnswers: Array<FormAnswer | null> = this.additionalQuestions
      .map((addQuestion, index) => {
        const answer = formValue.additionalQuestions[index]

        return answer
          ? { question: addQuestion.id, response: { value: answer } }
          : null
      })
      .filter((answer) => answer)

    const radioAnswers: Array<FormAnswer | null> = this.activityQuestions
      .filter(
        (actQuestion) => actQuestion.type === '5' || actQuestion.type === '3'
      )
      .map((actQuestion, index) => {
        const answer = formValue.activityQuestions.radioQuestions[index]

        return answer
          ? {
              question: actQuestion.id,
              response: { value: answer.toString() }
            }
          : null
      })
      .filter((answer) => answer)

    const checkboxAnswers: Array<FormAnswer | null> = this.activityQuestions
      .filter((actQuestion) => actQuestion.type === '4')
      .map((actQuestion, index) => {
        const answer = formValue.activityQuestions.checkboxQuestions[index]

        return answer
          ? {
              question: actQuestion.id,
              response: {
                value: answer
                  .map((selection, index) =>
                    selection ? actQuestion.options[index] : null
                  )
                  .filter((answer) => answer)
              }
            }
          : null
      })
      .filter((answer) => answer)

    return [...additionalAnswers, ...radioAnswers, ...checkboxAnswers]
  }

  private loadPatientInfo(
    data: AccSingleResponse,
    address: AccountAddress | null
  ): void {
    this.form.get('patient').patchValue({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.profile.gender,
      height: data.profile.height,
      phone: data.phone,
      dob: moment(data.profile.birthday),
      email: data.email,
      address1: address?.address1,
      address2: address?.address2,
      zip: address?.postalCode,
      state: address?.stateProvince,
      city: address?.city
    })

    this.form.get('patient').disable()
  }

  private resolveQuestions(form: FormSingle): void {
    const allQuestions = form.sections[0].questions

    this.additionalQuestions = allQuestions
      .filter((question) => question.questionType.id === '2')
      .map((question) => ({
        id: question.id,
        isRequired: question.isRequired,
        type: question.questionType.id,
        title: question.title
      }))

    this.activityQuestions = allQuestions
      .filter(
        (question) =>
          question.questionType.id === '5' ||
          question.questionType.id === '4' ||
          question.questionType.id === '3'
      )
      .map((question) => ({
        id: question.id,
        isRequired: question.isRequired,
        type: question.questionType.id,
        title: question.title,
        options: question.allowedValues
      }))
  }
}
