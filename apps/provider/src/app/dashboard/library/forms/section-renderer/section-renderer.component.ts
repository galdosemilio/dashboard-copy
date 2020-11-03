import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnInit
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { FormQuestion, FormSection } from '@app/dashboard/library/forms/models'
import { BindForm, BINDFORM_TOKEN } from '@app/shared'
import { FormAnswer } from '@app/shared/selvera-api'

@Component({
  selector: 'app-library-section-renderer',
  templateUrl: './section-renderer.component.html',
  styleUrls: ['./section-renderer.component.scss'],
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => SectionRendererComponent)
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SectionRendererComponent implements BindForm, OnInit {
  @Input()
  set answers(ans: FormAnswer[]) {
    this._answers = ans
    this.refresh()
  }

  get answers(): FormAnswer[] {
    return this._answers
  }
  @Input()
  readonly = false
  @Input()
  set section(section: FormSection) {
    let indexCount = 1
    this._section = section
    this.hasQuestions =
      this._section.questions.length &&
      !!this.section.questions.find(
        (question: FormQuestion) => !question.deleted
      )
    this.renderableQuestions = this.section.questions.filter(
      (question: FormQuestion) => !question.deleted
    )
    this.renderableIndexes = []
    this.renderableQuestions.forEach((question: FormQuestion) => {
      this.renderableIndexes.push(
        question.questionType.shouldHideIndex ? undefined : indexCount++
      )
    })
  }

  get section(): FormSection {
    return this._section
  }
  @Input()
  showHeader = true

  public form: FormGroup
  public hasQuestions: boolean
  public renderableQuestions: FormQuestion[] = []
  public renderableIndexes: number[] = []

  private _answers: FormAnswer[]
  private _section: FormSection

  constructor(private formBuilder: FormBuilder) {
    this.createForm()
  }

  ngOnInit(): void {
    this.refresh()
  }

  private createForm(): void {
    this.form = this.formBuilder.group({})
  }

  private refresh() {
    if (
      this.answers &&
      this.section &&
      this.section.questions &&
      this.section.questions.length
    ) {
      // TODO: Fix the npm-api to support the properly formatted question --Zcyon
      this.section.questions.forEach((q: FormQuestion) => {
        const answer: FormAnswer = this.answers.find(
          (a: FormAnswer) => a.question['id'] === q.id
        )
        q.answer = answer
      })
    }
  }
}
