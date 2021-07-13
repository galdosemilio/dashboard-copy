import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms'
import {
  Form,
  FormQuestion,
  FormSection,
  FormSubmission,
  ManagerEvents,
  QUESTION_TYPE_MAP
} from '@app/dashboard/library/forms/models'
import { ContextService, SelectedOrganization } from '@app/service'
import { _, BindForm, BINDFORM_TOKEN, CcrDropEvent } from '@app/shared'
import {
  AccountAccessData,
  FormAnswer,
  FormSubmission as FormSubmissionService
} from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { FormDisplayService } from '../services'
import { auditTime, takeUntil } from 'rxjs/operators'
import * as moment from 'moment'

interface ManagerDropEvent {
  index: number
  question: FormQuestion
  section: FormSection
}

@UntilDestroy()
@Component({
  selector: 'app-library-form-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => FormManagerComponent)
    }
  ]
})
export class FormManagerComponent implements BindForm, OnDestroy, OnInit {
  @Input()
  answers: FormAnswer[]
  @Input()
  content: Form
  @Input()
  fill = false
  @Input()
  preview = false
  @Input()
  readonly = false
  @Input()
  selectedClinic: SelectedOrganization
  @Input()
  set selectedDieter(dieter: AccountAccessData) {
    this._selectedDieter = dieter
    // Seems way more performant than detecting changes, although it looks hacky --Zcyon
    setTimeout(() => this.form.patchValue({ selectedDieter: dieter }))
    this.fetchDraft()
  }

  get selectedDieter(): AccountAccessData {
    return this._selectedDieter
  }

  @Input()
  submission: FormSubmission

  @Output()
  selectDieter: EventEmitter<void> = new EventEmitter<void>()

  public draftSaveDate: moment.Moment
  public events: ManagerEvents = new ManagerEvents()
  public form: FormGroup
  public isProvider: boolean
  public isSavingDraft: boolean
  public hasMultipleSections = false
  public selectedSection: FormSection

  private _selectedDieter: AccountAccessData
  private defaultSectionName: string
  private draftAuditTime = 5000
  private hasDraft: boolean
  private selectedQuestion: FormQuestion
  private updatedSections: FormSection[] = []

  constructor(
    public formDisplay: FormDisplayService,
    private cdr: ChangeDetectorRef,
    private context: ContextService,
    private formBuilder: FormBuilder,
    private formSubmission: FormSubmissionService,
    private translate: TranslateService
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.isProvider = this.context.isProvider

    if (this.content.id) {
      this.fetchDraft()
    }

    this.createForm()
    if (!this.content.sections.length) {
      this.addFormSection()
      this.addFormQuestion(this.content.sections[0])
    }
    this.subscribeToEvents()
    this.updateDefaultSectionName()
    this.checkForMultipleSections()
  }

  addFormSection(title = this.defaultSectionName || '') {
    const index: number = this.content.sections
      .map((s) => s.sortOrder)
      .reduce((highest, current) => (highest > current ? highest : current), 0)

    const localIndex: number = this.content.sections.filter(
      (s: FormSection) => !s.deleted
    ).length
    const newSection: FormSection = new FormSection(
      {
        id: index.toString(),
        title: `${title} ${localIndex + 1}`,
        questions: [],
        sortOrder: index + 1,
        created: true,
        edited: true
      },
      { form: { id: this.content.id } }
    )

    this.hasMultipleSections = true
    this.content.sections.push(newSection)
    this.cdr.detectChanges()
  }

  public saveForm(): void {
    this.formDisplay.save$.next()
    this.removeDraft()
  }

  private addFormQuestion(section: FormSection): void {
    const type = QUESTION_TYPE_MAP[1]

    if (!this.form.valid) {
      return
    }

    const newQuestion: FormQuestion = new FormQuestion({
      created: true,
      edited: true,
      section: { id: section.id, name: section.title },
      questionType: type
    })

    this.events.questionAdded.emit(newQuestion)
  }

  private arrayify(obj: any): any[] {
    const arrayified: any[] = []
    Object.keys(obj).forEach((key: string) => (arrayified[key] = obj[key]))
    return arrayified
  }

  private checkForMultipleSections() {
    this.hasMultipleSections =
      this.content.sections.length &&
      this.content.sections.filter((section: FormSection) => !section.deleted)
        .length > 1
  }

  private createForm() {
    this.form = this.formBuilder.group({
      sections: this.formBuilder.group({}),
      updatedSections: [
        [],
        (control: AbstractControl) => {
          if (
            control.value &&
            control.value.length &&
            !control.value.find((section) => !section.deleted)
          ) {
            return { noSections: true }
          }
        }
      ],
      selectedDieter: [undefined],
      values: this.formBuilder.group({})
    })

    this.form.controls.sections.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls: any) => {
        if (controls && Object.keys(controls).length) {
          this.updateSections(controls)
          this.form.patchValue({ updatedSections: this.updatedSections })
          this.checkForMultipleSections()
          this.formDisplay.toggleSave$.next(this.form.valid)
          setTimeout(() => this.events.refreshQuestionIndexes.emit())
        }
      })

    if (this.content.id && this.fill) {
      this.form.valueChanges
        .pipe(
          untilDestroyed(this),
          auditTime(this.draftAuditTime),
          takeUntil(this.formDisplay.save$)
        )
        .subscribe(() => {
          void this.saveDraft()
        })
    }
  }

  private async fetchDraft(): Promise<void> {
    try {
      const draft = await this.formSubmission.getDraft({
        account: this.selectedDieter.id,
        form: this.content.id
      })

      this.hasDraft = true
      this.draftSaveDate = moment(draft.data.date)
      this.form.patchValue(draft.data.form)
    } catch (error) {
      this.hasDraft = false
    }
  }

  private async removeDraft(): Promise<void> {
    if (!this.hasDraft) {
      return
    }

    try {
      await this.formSubmission.deleteDraft({
        account: this.selectedDieter.id,
        form: this.content.id
      })
      this.hasDraft = false
    } catch (error) {}
  }

  private async saveDraft(): Promise<void> {
    try {
      const {
        sections,
        selectedDieter,
        updatedSections,
        values,
        ...draftData
      } = this.form.value

      this.isSavingDraft = true
      await this.formSubmission.upsertDraft({
        account: this.selectedDieter.id,
        form: this.content.id,
        data: { form: draftData, date: moment().toISOString() }
      })

      this.hasDraft = true
      this.draftSaveDate = moment()
    } catch (error) {
    } finally {
      this.isSavingDraft = false
    }
  }

  private stageQuestionChanges(question: FormQuestion = this.selectedQuestion) {
    const updatedQuestion: FormQuestion | any =
      this.updatedSections
        .find((s: FormSection) => s && s.id === question.section.id)
        .questions.find((q: FormQuestion) => q && q.id === question.id) || {}

    Object.keys(updatedQuestion).forEach(
      (key: string) =>
        (updatedQuestion[key] =
          updatedQuestion[key] !== undefined && updatedQuestion[key] !== null
            ? updatedQuestion[key].value || updatedQuestion[key]
            : undefined)
    )

    const targetSectionIndex: number = this.content.sections.findIndex(
      (s: FormSection) => s.id === question.section.id
    )

    const targetQuestionIndex = this.content.sections[
      targetSectionIndex
    ].questions.findIndex((q: FormQuestion) => q.id === question.id)

    const targetQuestion: FormQuestion = this.content.sections[
      targetSectionIndex
    ].questions[targetQuestionIndex]

    Object.keys(targetQuestion).forEach((key: string) => {
      if (updatedQuestion[key] !== undefined) {
        targetQuestion[key] = updatedQuestion[key]
      }
    })
    this.events.questionStaged.emit()
  }

  private stageSectionChanges(): void {
    this.updatedSections.forEach((updatedSection: FormSection) => {
      let section: FormSection = this.content.sections.find(
        (s: FormSection) => s.id === updatedSection.id
      )
      if (section) {
        section = Object.assign(section, {
          title: updatedSection.title,
          edited: updatedSection.edited,
          deleted: updatedSection.deleted,
          description: updatedSection.description
        })
      }
    })
  }

  private subscribeToEvents() {
    this.events.questionSelected
      .pipe(untilDestroyed(this))
      .subscribe((question: FormQuestion) => {
        if (question) {
          if (
            this.selectedQuestion &&
            question.id !== this.selectedQuestion.id
          ) {
            this.stageQuestionChanges()
          }
          const updatedSection = this.updatedSections.find(
            (uS: FormSection) => {
              return uS && uS.id === question.section.id
            }
          )

          this.selectedQuestion = updatedSection
            ? updatedSection.questions.find(
                (q: FormQuestion) => q.id === question.id
              )
            : undefined
        } else if (this.selectedQuestion) {
          this.stageQuestionChanges()
          delete this.selectedQuestion
        }
      })

    this.events.moveQuestion
      .pipe(untilDestroyed(this))
      .subscribe((moveEvent: CcrDropEvent<ManagerDropEvent>) => {
        if (this.selectedQuestion) {
          this.stageQuestionChanges()
        }

        const draggedIndex: number = moveEvent.drag.index,
          droppedIndex: number = moveEvent.drop.index

        const draggedSectionIndex: number = this.content.sections.findIndex(
            (s: FormSection) => s.id === moveEvent.drag.question.section.id
          ),
          droppedSectionIndex: number = this.content.sections.findIndex(
            (s: FormSection) => s.id === moveEvent.drop.question.section.id
          )

        const areDifferentSections: boolean =
          this.content.sections[draggedSectionIndex].id !==
          this.content.sections[droppedSectionIndex].id

        if (!areDifferentSections && draggedIndex === droppedIndex) {
          return
        }

        const draggedQuestion: FormQuestion = this.content.sections[
            draggedSectionIndex
          ].questions[draggedIndex],
          droppedQuestion: FormQuestion = this.content.sections[
            droppedSectionIndex
          ].questions[droppedIndex]

        const cache: FormQuestion = droppedQuestion
        const indexCache: number = draggedQuestion.sortOrder

        this.content.sections[droppedSectionIndex].questions[droppedIndex] = {
          ...draggedQuestion,
          id: draggedQuestion.inServer
            ? draggedQuestion.id
            : droppedQuestion.id,
          sortOrder: droppedQuestion.sortOrder,
          edited: true,
          isMoved: true,
          section: droppedQuestion.section,
          recreated: areDifferentSections
        }
        this.content.sections[draggedSectionIndex].questions[draggedIndex] = {
          ...cache,
          id: cache.inServer ? cache.id : draggedQuestion.id,
          sortOrder: indexCache,
          edited: true,
          isMoved: true,
          section: draggedQuestion.section,
          recreated: areDifferentSections
        }

        this.updateSections(this.content.sections)
        this.form.patchValue({ updatedSections: this.updatedSections })
        this.cdr.detectChanges()
        this.events.questionSelected.emit()
      })

    this.events.moveQuestionIntoSection
      .pipe(untilDestroyed(this))
      .subscribe((moveEvent: CcrDropEvent<ManagerDropEvent>) => {
        if (this.selectedQuestion) {
          this.stageQuestionChanges()
        }

        const section: FormSection = moveEvent.drop.section,
          question: FormQuestion = moveEvent.drag.question,
          draggedIndex: number = moveEvent.drag.index

        if (section.id === question.section.id) {
          return
        }

        const sourceIndex: number = this.content.sections.findIndex(
            (sourceSection: FormSection) =>
              question.section.id === sourceSection.id
          ),
          targetIndex: number = this.content.sections.findIndex(
            (targetSection: FormSection) => targetSection.id === section.id
          )

        const splicedQuestion: FormQuestion = {
            ...this.content.sections[sourceIndex].questions[draggedIndex]
          },
          sortOrder = Math.max(
            ...this.content.sections[targetIndex].questions.map(
              (targetQuestion: FormQuestion) => targetQuestion.sortOrder
            )
          )

        splicedQuestion.section = { id: section.id }
        splicedQuestion.sortOrder =
          sortOrder === Number.NEGATIVE_INFINITY ? 1 : sortOrder + 1
        this.content.sections[targetIndex].questions.push(splicedQuestion)
        this.content.sections[sourceIndex].questions[
          draggedIndex
        ].deleted = true
        this.events.removeQuestion.emit(
          this.content.sections[sourceIndex].questions[draggedIndex]
        )
        splicedQuestion.edited = true
        splicedQuestion.isMoved = true
        splicedQuestion.created = true
        splicedQuestion.inServer = false

        this.updateSections(this.content.sections)
        this.form.patchValue({ updatedSections: this.updatedSections })
        this.cdr.detectChanges()
        this.events.questionSelected.emit()
      })

    this.translate.onLangChange
      .pipe(untilDestroyed(this))
      .subscribe(() => this.updateDefaultSectionName())

    this.formDisplay.togglePreview$
      .pipe(untilDestroyed(this))
      .subscribe((value: boolean) => {
        this.preview = value
        if (value && this.selectedQuestion) {
          this.stageQuestionChanges()
        }
        this.stageSectionChanges()
      })
  }

  private updateDefaultSectionName() {
    this.translate
      .get([_('LIBRARY.FORMS.NEW_SECTION')])
      .pipe(untilDestroyed(this))
      .subscribe(
        (i18n) => (this.defaultSectionName = i18n['LIBRARY.FORMS.NEW_SECTION'])
      )
  }

  private updateSections(formSections: any) {
    const sectionArray: FormSection[] = this.arrayify(formSections)

    sectionArray.forEach((section: FormSection, index: number) => {
      const updatedSection: any = this.updatedSections[index] || {}
      section.questions = this.arrayify(section.questions)

      const updatedQuestions: FormQuestion[] = this.updatedSections[index]
        ? this.updatedSections[index].questions || []
        : []

      section.questions.forEach((sQ: FormQuestion, uQIndex: number) => {
        Object.keys(sQ).forEach(
          (key: string) =>
            (sQ[key] =
              sQ[key] !== undefined ? sQ[key].value || sQ[key] : undefined)
        )

        updatedQuestions[uQIndex] = Object.assign(
          updatedQuestions[uQIndex] || {},
          sQ
        )
      })

      this.updatedSections[index] = Object.assign(updatedSection, section, {
        questions: updatedQuestions
      })
    })
  }
}
