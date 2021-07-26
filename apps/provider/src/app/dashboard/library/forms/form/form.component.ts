import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ActivatedRoute } from '@angular/router'
import { PatientSelectDialog } from '@app/dashboard/library/forms/dialogs'
import {
  Form,
  FormQuestion,
  FormSection,
  FormSubmission
} from '@app/dashboard/library/forms/models'
import {
  FormDisplayService,
  FormsDatabase,
  FormsDatasource,
  FormSubmissionsDatabase
} from '@app/dashboard/library/forms/services'
import { FormsSyncer } from '@app/dashboard/library/forms/utils'
import {
  ContextService,
  NotifierService,
  SelectedOrganization
} from '@app/service'
import { _, BindForm, BINDFORM_TOKEN, PromptDialog } from '@app/shared'
import { FormAnswer } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, Observable } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'app-library-forms-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => LibraryFormComponent)
    }
  ]
})
export class LibraryFormComponent implements BindForm, OnDestroy, OnInit {
  @Input()
  set account(acc: any) {
    setTimeout(() => this.setSelectedDieter(acc || this.context.user))
  }
  get account(): any {
    return this._account
  }
  @Input()
  allowAccountChange = true
  @Input()
  answers: FormAnswer[]
  @Input()
  data: Form
  @Input()
  fill = false
  @Input()
  formSubmission: FormSubmission
  @Input()
  readonly = false
  @Input()
  showcase = false

  public errorMessage: string
  public form: FormGroup
  public hasError: boolean
  public invalidAccount: boolean
  public preview = false
  public selectedClinic: SelectedOrganization
  public showIntro = false
  public source: FormsDatasource

  private _account: any
  private formsSyncer: FormsSyncer
  private isSaving = false

  constructor(
    public formDisplay: FormDisplayService,
    private context: ContextService,
    private formBuilder: FormBuilder,
    private database: FormsDatabase,
    private dialog: MatDialog,
    private notifier: NotifierService,
    private route: ActivatedRoute,
    private submissionsDatabase: FormSubmissionsDatabase
  ) {
    this.source = new FormsDatasource(
      this.context,
      this.database,
      this.notifier
    )
    this.source.addDefault({ organization: this.context.organization.id })
    this.formsSyncer = new FormsSyncer(this.source)
    this.source.isLoading = false
    this.route.data.subscribe((data: any) => {
      this.fill = data.fill || false
      this.readonly = data.readonly || false
      this.data = data.form || this.data
      this.answers = data.formSubmission ? data.formSubmission.answers : []
      this.formSubmission = data.formSubmission || this.formSubmission
      this._account = data.formSubmission
        ? data.formSubmission.account
        : undefined
      this.showIntro = this.fill ? true : false
      this.checkForErrors(data)
    })
    this.createForm()
    this.subscribeToEvents()
  }

  canDeactivate(): Observable<boolean> {
    return from(
      new Promise<boolean>((resolve) => {
        if (
          !this.fill &&
          !this.readonly &&
          !this.hasError &&
          !this.isSaving &&
          this.hasUnsavedChanges()
        ) {
          this.dialog
            .open(PromptDialog, {
              data: {
                title: _('LIBRARY.FORMS.UNSAVED_CHANGES'),
                content: _('LIBRARY.FORMS.UNSAVED_CHANGES_WARNING')
              }
            })
            .afterClosed()
            .subscribe(resolve)
        } else {
          resolve(true)
        }
      })
    )
  }

  public ngOnInit(): void {
    if (this.formSubmission) {
      this.selectedClinic = this.formSubmission.organization
    }

    this.context.organization$
      .pipe(untilDestroyed(this))
      .subscribe((organization) => {
        this.selectedClinic = this.formSubmission
          ? this.formSubmission.organization
          : organization

        if (this.formSubmission) {
          return
        }

        this.hasError =
          !this.selectedClinic.permissions.viewAll ||
          !this.selectedClinic.permissions.allowClientPhi ||
          !this.selectedClinic.permissions.admin
        this.errorMessage = this.hasError
          ? _('NOTIFY.INFO.GENERAL_PERMISSION_ACCESS_NOTIFICATION')
          : ''
      })
  }

  ngOnDestroy(): void {
    this.formDisplay.togglePreview$.next(false)
  }

  async onSave(): Promise<void> {
    if ((!this.preview && !this.form.valid) || this.isSaving) {
      return
    }
    try {
      this.isSaving = true
      if (this.fill) {
        const answers: FormAnswer[] = []
        const formValue: any = this.form.value.values

        Object.keys(formValue).forEach((section) => {
          if (formValue[section]) {
            Object.keys(formValue[section]).forEach((question) => {
              const questionValue: any = formValue[section][question]
                ? formValue[section][question].value
                : undefined
              if (questionValue) {
                answers.push({
                  question: question,
                  response: {
                    value: questionValue.length
                      ? questionValue
                      : questionValue.toString()
                  }
                })
              }
            })
          }
        })

        await this.source.createFormSubmission({
          form: this.data.id,
          account: formValue.selectedDieter
            ? formValue.selectedDieter.id
            : this.context.user.id,
          submittedBy: this.context.user.id,
          answers: answers
        })
        this.notifier.success(_('NOTIFY.SUCCESS.FORM_SUBMITTED'))
        this.formDisplay.saved$.next()
      } else {
        if (
          this.haveQuestionsSections(this.form.value.sections.updatedSections)
        ) {
          await this.syncSections(this.form.value.sections.updatedSections)
        } else {
          this.dialog
            .open(PromptDialog, {
              data: {
                title: _('LIBRARY.FORMS.SAVE_FORM'),
                content: _('LIBRARY.FORMS.SAVE_FORM_WARNING_EMPTY_SECTION')
              }
            })
            .afterClosed()
            .subscribe(async (confirmation: boolean) => {
              if (confirmation) {
                await this.syncSections(
                  this.form.value.sections.updatedSections
                )
              }
            })
        }
      }
    } catch (error) {
      this.notifier.error(error)
    } finally {
      this.isSaving = false
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.value.sections.updatedSections.find(
      (section: FormSection) =>
        section.edited ||
        section.questions.find((question: FormQuestion) => question.edited)
    )
  }

  selectDieter(): void {
    if (!this.allowAccountChange) {
      return
    }
    this.dialog
      .open(PatientSelectDialog, {
        autoFocus: false,
        disableClose: true,
        width: '80vw',
        panelClass: 'ccr-full-dialog'
      })
      .afterClosed()
      .subscribe(async (dieter) => {
        this.answers = []
        this.readonly = false
        this.account = dieter
      })
  }

  private checkForErrors(data: any): void {
    const hasQuestions: boolean =
      this.data && this.data.sections
        ? !!this.data.sections.find((s: FormSection) => s.questions.length > 0)
        : false
    this.hasError =
      (data.fill && !hasQuestions) || (!data.fill && data.hasSubmissions)
        ? true
        : false

    this.errorMessage = data.hasSubmissions
      ? _('LIBRARY.FORMS.NON_EDITABLE_NOTICE')
      : !hasQuestions
      ? _('LIBRARY.FORMS.NO_QUESTIONS_NOTICE')
      : ''
  }

  private createForm(): void {
    this.form = this.formBuilder.group({})
  }

  private async setSelectedDieter(dieter) {
    if (!this.showcase) {
      this.source.isLoading = true
      this.source.change$.next()
      const res = await this.submissionsDatabase
        .fetch({
          form: this.data.id,
          organization: this.context.organizationId,
          account: dieter.id,
          limit: 1
        })
        .toPromise()

      this.invalidAccount = this.data.maximumSubmissions
        ? res.data.length >= this.data.maximumSubmissions
        : false

      this._account = dieter

      if (this.invalidAccount && !(this.answers && this.answers.length)) {
        const submission = await this.submissionsDatabase
          .fetchAnswers({ id: res.data[0].id })
          .toPromise()

        this.formSubmission = submission as any
        this.answers = submission.answers
        this.readonly = true
        this.showIntro = true
      } else if (!this.invalidAccount) {
        this.fill = true
        this.readonly = false
        this.formSubmission = undefined
        this.showIntro = false
      }

      this.source.isLoading = false
      this.source.change$.next()
    }
  }

  private subscribeToEvents() {
    this.formDisplay.save$
      .pipe(untilDestroyed(this))
      .subscribe(() => this.onSave())
    this.formDisplay.togglePreview$
      .pipe(untilDestroyed(this))
      .subscribe((value: boolean) => (this.preview = value))
  }

  private async syncSections(updatedSections: Array<FormSection>) {
    // Remove the sections without questions
    updatedSections = updatedSections.filter((section) => {
      const questionLength = section.questions ? section.questions.length : 0
      if (section.inServer || questionLength > 0) {
        const hasNonDeletedQuestion = section.questions.find(
          (question) => !question.deleted
        )
        if (
          !hasNonDeletedQuestion ||
          section.deleted ||
          !section.questions.length
        ) {
          section.deleted = true
          section.questions = [] // this because the section deletes the question also
        }
        return section
      }
    })
    await this.formsSyncer.syncSections(updatedSections)
    this.notifier.success(_('NOTIFY.SUCCESS.FORM_UPDATED'))
    this.formDisplay.saved$.next()
  }

  private haveQuestionsSections(sections: Array<FormSection>): boolean {
    return !sections.find(
      (section) =>
        section &&
        !section.deleted &&
        (!section.questions ||
          !section.questions.length ||
          !section.questions.find(
            (question: FormQuestion) => !question.deleted
          ))
    )
  }
}
