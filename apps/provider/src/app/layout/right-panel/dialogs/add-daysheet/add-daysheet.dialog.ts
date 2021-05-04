import { AfterViewInit, Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@coachcare/material'
import { resolveConfig } from '@app/config/section'
import { Form } from '@app/dashboard/library/forms/models'
import {
  FormsDatabase,
  FormsDatasource
} from '@app/dashboard/library/forms/services'
import { ContextService, NotifierService } from '@app/service'
import { _ } from '@app/shared'
import { AccountAccessData } from '@coachcare/sdk'

@Component({
  selector: 'add-daysheet-dialog',
  templateUrl: './add-daysheet.dialog.html',
  host: { class: 'ccr-dialog' }
})
export class AddDaysheetDialog implements AfterViewInit, OnInit {
  firstQuestionOptions: string[] = []
  form: FormGroup
  isLoading: boolean
  questionTitles: string[] = []
  remoteForm: Form
  secondQuestionOptions: string[] = []
  thirdQuestionOptions: string[] = []
  selectedDieter: AccountAccessData

  private formId = ''
  private source: FormsDatasource

  constructor(
    private context: ContextService,
    private database: FormsDatabase,
    private dialogRef: MatDialogRef<AddDaysheetDialog>,
    private fb: FormBuilder,
    private notify: NotifierService
  ) {}

  ngAfterViewInit(): void {
    this.fetchForm()
  }

  ngOnInit(): void {
    this.selectedDieter = this.context.account
    this.formId = resolveConfig(
      'RIGHT_PANEL.DAYSHEETS_FORM',
      this.context.organization
    )
    this.createForm()
    this.createDatasource()
  }

  async onSubmit() {
    try {
      this.isLoading = true
      const formData = this.form.value
      const submission = await this.source.createFormSubmission({
        form: this.formId,
        account: this.context.accountId,
        submittedBy: this.context.user.id,
        answers: [
          {
            question: this.remoteForm.sections[0].questions[0].id,
            response: { value: formData.stage }
          },
          {
            question: this.remoteForm.sections[0].questions[1].id,
            response: { value: formData.greenClient }
          },
          {
            question: this.remoteForm.sections[0].questions[2].id,
            response: {
              value: formData.photoTaken
            }
          },
          {
            question: this.remoteForm.sections[0].questions[3].id,
            response: { value: formData.weightLost }
          },
          {
            question: this.remoteForm.sections[0].questions[4].id,
            response: { value: formData.miscellaneousNotes }
          }
        ].filter((element) => element)
      })

      this.form.reset()
      this.dialogRef.close(submission.id)
      this.notify.success(_('NOTIFY.SUCCESS.DAYSHEET_ADDED'))
    } catch (error) {
      this.notify.error(_('NOTIFY.ERROR.DAYSHEET_ADDED'))
    } finally {
      this.isLoading = false
    }
  }

  private createDatasource(): void {
    this.source = new FormsDatasource(this.context, this.database, this.notify)
  }

  private createForm(): void {
    this.form = this.fb.group({
      weightLost: ['', Validators.required],
      stage: ['', Validators.required],
      greenClient: [null, Validators.required],
      photoTaken: [null, Validators.required],
      miscellaneousNotes: ['']
    })
  }

  private async fetchForm() {
    try {
      const form = new Form(
        await this.source.readForm({ id: this.formId, full: true })
      )
      this.remoteForm = form
      this.firstQuestionOptions = form.sections[0].questions[0].allowedValues.slice()
      this.secondQuestionOptions = form.sections[0].questions[1].allowedValues.slice()
      this.thirdQuestionOptions = form.sections[0].questions[2].allowedValues.slice()
      this.questionTitles[0] = form.sections[0].questions[0].title
      this.questionTitles[1] = form.sections[0].questions[1].title
      this.questionTitles[2] = form.sections[0].questions[2].title
      this.questionTitles[3] = form.sections[0].questions[3].title
      this.questionTitles[4] = form.sections[0].questions[4].title
    } catch (error) {
      this.notify.error(error)
    }
  }
}
