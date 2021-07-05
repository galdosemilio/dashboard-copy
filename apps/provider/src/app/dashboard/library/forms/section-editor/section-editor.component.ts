import {
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog, MatSelect, MatSelectChange } from '@coachcare/material'
import {
  FormQuestion,
  FormQuestionType,
  FormSection,
  ManagerEvents,
  QUESTION_TYPE_MAP
} from '@app/dashboard/library/forms/models'
import {
  _,
  BindForm,
  BINDFORM_TOKEN,
  CcrDropEvent,
  PromptDialog
} from '@app/shared'
import { TranslateService } from '@ngx-translate/core'
import { cloneDeep } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-library-section-editor',
  templateUrl: './section-editor.component.html',
  styleUrls: ['./section-editor.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => SectionEditorComponent)
    }
  ]
})
export class SectionEditorComponent implements BindForm, OnDestroy, OnInit {
  @Input()
  events: ManagerEvents

  @Input()
  set section(s: FormSection) {
    if (s) {
      if (!this.originalSection) {
        this.originalSection = cloneDeep(s)
      }
      const questionPatchValue: any = {}
      this.form.patchValue(s)
      s.questions.forEach((q: FormQuestion, index: number) => {
        questionPatchValue[index] = q
        ;(this.form.controls.questions as FormGroup).addControl(
          `${index}`,
          new FormControl(q)
        )
      })
      this._section = s
      this.updateQuestionIndexes()
    }
  }
  get section(): FormSection {
    return this._section
  }

  @Input()
  set showHeader(show: boolean) {
    if (!show) {
      this.form.patchValue({
        title: this.translations['LIBRARY.FORMS.DEFAULT_SECTION_TITLE'],
        description: this.translations[
          'LIBRARY.FORMS.DEFAULT_SECTION_DESCRIPTION'
        ]
      })
    } else if (this._showHeader !== undefined) {
      this.form.patchValue({
        title: `${this.translations['LIBRARY.FORMS.NEW_SECTION']} 1`,
        description: ''
      })
    }
    this._showHeader = show
  }

  get showHeader(): boolean {
    return this._showHeader
  }

  @ViewChild('newQuestionType', { static: false }) typeSelect: MatSelect

  public activeSectionInput: string
  public form: FormGroup
  public hasQuestions: boolean
  public questionTypes = Object.keys(QUESTION_TYPE_MAP).map(
    (key: any) => QUESTION_TYPE_MAP[key]
  )
  public valueForm: FormGroup

  private _section: FormSection
  private _showHeader: boolean
  private originalSection: FormSection
  private propsForCheck: string[] = ['title', 'description', 'sortOrder']
  private translations: any = {}

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private dialog: MatDialog
  ) {
    this.createForm()
    this.getTranslations()
    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.getTranslations())
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.subscribeToEvents()
  }

  addFormQuestion(type?: FormQuestionType): void {
    if (!this.form.valid) {
      return
    }

    const newQuestion: FormQuestion = new FormQuestion({
      created: true,
      edited: true,
      section: { id: this.section.id, name: this.section.title },
      questionType: type
    })

    this.events.questionAdded.emit(newQuestion)
  }

  onDrop(dropEvent: CcrDropEvent): void {
    this.events.moveQuestion.emit(dropEvent)
  }

  onDropIntoNewQuestion(dropEvent: CcrDropEvent): void {
    this.events.moveQuestionIntoSection.emit(dropEvent)
  }

  onSelectQuestionType($event: MatSelectChange): void {
    if ($event.value) {
      this.addFormQuestion($event.value)
      this.typeSelect.value = undefined
    }
  }

  questionTypeCompare(
    questionTypeA: FormQuestionType,
    questionTypeB: FormQuestionType
  ): boolean {
    return (
      questionTypeA && questionTypeB && questionTypeA.id === questionTypeB.id
    )
  }

  removeSection(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.DELETE_SECTION_TITLE'),
          content: _('LIBRARY.FORMS.DELETE_SECTION_CONTENT')
        }
      })
      .afterClosed()
      .subscribe((confirmation: boolean) => {
        if (confirmation) {
          this.section.deleted = true
          this.form.patchValue({ deleted: true })
        }
      })
  }

  selectQuestion(question: FormQuestion): void {
    if (!this.form.valid) {
      return
    }
    this.events.questionSelected.emit(question)
  }

  setActiveSectionInput(name: string): void {
    this.activeSectionInput = name
  }

  private checkForEdits(): boolean {
    const currentFormSection: FormSection = this.form.value
    return !!Object.keys(currentFormSection)
      .filter((key: string) => this.propsForCheck.indexOf(key) > -1)
      .find(
        (key: string) => currentFormSection[key] !== this.originalSection[key]
      )
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      id: ['', Validators.required],
      edited: [false],
      title: ['', Validators.required],
      description: [''],
      questions: this.formBuilder.group({}),
      sortOrder: [undefined, Validators.required],
      created: [false],
      deleted: [false],
      form: [undefined, Validators.required],
      isMoved: [false],
      inServer: [false]
    })

    this.form.valueChanges.pipe(untilDestroyed(this)).subscribe((controls) => {
      if (!controls.edited && this.checkForEdits()) {
        this.form.patchValue({ edited: true })
      }

      if (this.section && this.section.questions) {
        this.hasQuestions =
          this.section.questions.length &&
          !!this.section.questions.find(
            (question: FormQuestion) => !question.deleted
          )

        if (
          !controls.edited &&
          this.section.questions.find(
            (question: FormQuestion) => question.edited
          )
        ) {
          this.form.patchValue({ edited: true })
        }
      }
    })

    /*
      Watch this form closely as it's here just to test how would we get values
      from the dynamically rendered Question components.
    */
    this.valueForm = this.formBuilder.group({})
    // this.valueForm.valueChanges
    //   .pipe(untilDestroyed(this))
    //   .subscribe(controls => console.log({ controls }));
  }

  private getTranslations() {
    this.translate
      .get([
        _('LIBRARY.FORMS.DEFAULT_SECTION_TITLE'),
        _('LIBRARY.FORMS.DEFAULT_SECTION_DESCRIPTION'),
        _('LIBRARY.FORMS.NEW_SECTION'),
        _('LIBRARY.FORMS.QUESTION_TITLE')
      ])
      .pipe(untilDestroyed(this))
      .subscribe((translations: any) => {
        this.translations = translations
      })
  }

  private subscribeToEvents(): void {
    this.events.questionAdded
      .pipe(untilDestroyed(this))
      .subscribe((question: FormQuestion) => {
        if (question.section.id === this.section.id) {
          const index: number = this.section.questions
            .map((q) => q.sortOrder)
            .reduce(
              (highest, current) => (highest > current ? highest : current),
              0
            )

          question.id = `${this.section.id}${this.section.questions.length + 1}`
          question.sortOrder = index + 1
          this.section.questions.push(question)
          this.cdr.detectChanges()
          this.events.questionSelected.emit(question)
          this.updateQuestionIndexes()
        }
      })

    this.events.refreshQuestionIndexes
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateQuestionIndexes())

    this.events.removeQuestion
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateQuestionIndexes())
  }

  private updateQuestionIndexes(): void {
    let index = 0
    this.section.questions.forEach((question: FormQuestion) => {
      if (!question.deleted) {
        question.index = ++index
      }
    })
    this.cdr.detectChanges()
  }
}
