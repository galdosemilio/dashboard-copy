import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@coachcare/material'
import { ManagerEvents } from '@app/dashboard/library/forms/models'
import { _ } from '@app/shared/utils'
import { PromptDialog } from '@app/shared/dialogs'
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives'
import {
  FormQuestion,
  QUESTION_TYPE_MAP,
  FormQuestionType
} from '@app/shared/model'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'
import { FileExplorerContent } from '../../content/models'

@UntilDestroy()
@Component({
  selector: 'app-library-question-editor',
  templateUrl: './question-editor.component.html',
  styleUrls: ['./question-editor.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => QuestionEditorComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuestionEditorComponent
  implements AfterViewInit, BindForm, OnDestroy, OnInit
{
  @Input()
  active = true
  @Input()
  events: ManagerEvents
  @Input()
  set question(q: FormQuestion) {
    if (q) {
      this.form.patchValue(q)
      this._question = q
    }
  }
  get question(): FormQuestion {
    return this._question
  }

  @ViewChild('questionEditor', { static: false }) editor: ElementRef

  public form: FormGroup
  public matSelectIsOpen = false
  public questionTypes = Object.keys(QUESTION_TYPE_MAP).map(
    (key: any) => QUESTION_TYPE_MAP[key]
  )

  private _question: FormQuestion

  constructor(private dialog: MatDialog, private formBuilder: FormBuilder) {
    this.createForm()
  }

  ngAfterViewInit(): void {
    this.subscribeToEvents()
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    setTimeout(
      () =>
        fromEvent(document, 'click')
          .pipe(untilDestroyed(this))
          .subscribe(($event) => {
            if (
              this.editor &&
              this.form.valid &&
              !this.matSelectIsOpen &&
              !this.dialog.openDialogs.length &&
              !this.editor.nativeElement.contains($event.target)
            ) {
              this.events.questionSelected.emit()
            }
          }),
      100
    )
  }

  duplicateQuestion(): void {
    this.events.questionAdded.emit(
      new FormQuestion(
        { ...this.form.value, id: '', created: true, edited: true },
        {}
      )
    )
  }

  questionTypeCompare(
    questionTypeA: FormQuestionType,
    questionTypeB: FormQuestionType
  ): boolean {
    return questionTypeA.id === questionTypeB.id
  }

  removeQuestion(): void {
    this.dialog
      .open(PromptDialog, {
        data: {
          title: _('LIBRARY.FORMS.DELETE_QUESTION_TITLE'),
          content: _('LIBRARY.FORMS.DELETE_QUESTION_CONTENT')
        }
      })
      .afterClosed()
      .pipe(filter((confirm) => confirm))
      .subscribe(() => {
        this.question.deleted = true
        this.form.patchValue({ deleted: true })
      })
  }

  selectContent(content: FileExplorerContent) {
    this.form.patchValue({
      title: content.metadata.url,
      description: content.metadata.mimeType
    })
  }

  private createForm(): void {
    // Would be nice to have strongly typed reactive forms... --Zcyon
    this.form = this.formBuilder.group({
      allowedValues: [undefined],
      created: [false],
      deleted: [false],
      description: [''],
      edited: [false],
      id: ['', Validators.required],
      isRequired: [false, Validators.required],
      title: ['', Validators.required],
      questionType: ['', Validators.required],
      section: [undefined, Validators.required],
      sortOrder: [undefined, Validators.required],
      inServer: [false]
    })
  }

  private subscribeToEvents(): void {
    this.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((controls: any) => {
        if (!controls.edited) {
          this.question.edited = true
          this.form.patchValue({ edited: true })
        }

        if (controls.deleted) {
          this.form.controls.title.disable({ emitEvent: false })
        }

        if (controls.questionType.disregardRequired && controls.isRequired) {
          this.form.patchValue({ isRequired: false })
        }
        this.events.questionSelected.emit(this.question)
      })

    this.events.removeQuestion
      .pipe(untilDestroyed(this))
      .subscribe((question: FormQuestion) => {
        if (question.id === this.question.id) {
          this.form.patchValue({ deleted: true })
        }
      })
  }
}
