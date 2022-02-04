import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Injector,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DomSanitizer } from '@angular/platform-browser'
import { ManagerEvents } from '@app/dashboard/library/forms/models'
import { QuestionDetails } from '@app/dashboard/library/forms/questions'
import { BindForm, BINDFORM_TOKEN } from '@app/shared/directives'
import { FormQuestion } from '@app/shared/model'
import { FormAnswer } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-library-question-renderer',
  templateUrl: './question-renderer.component.html',
  styleUrls: ['./question-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: BINDFORM_TOKEN,
      useExisting: forwardRef(() => QuestionRendererComponent)
    }
  ]
})
export class QuestionRendererComponent implements BindForm, OnDestroy, OnInit {
  @Input()
  answer: FormAnswer
  @Input()
  events: ManagerEvents
  @Input()
  question: FormQuestion
  @Input()
  readonly = false

  public collapsed: boolean
  public form: FormGroup
  public hasAnswer: boolean
  public questionInjector: Injector

  constructor(
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private injector: Injector,
    private sanitizer: DomSanitizer
  ) {
    this.createForm()
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.hasAnswer = !this.readonly || !!this.answer
    this.collapsed = !this.hasAnswer

    if (this.question.questionType.usesUrl) {
      this.question.url = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.question.title
      ) as string
    }
    this.questionInjector = Injector.create({
      providers: [
        {
          provide: QuestionDetails,
          useValue: {
            question: this.question,
            readonly: this.readonly,
            answer: this.answer
          }
        },
        {
          provide: BINDFORM_TOKEN,
          useExisting: forwardRef(() => QuestionRendererComponent)
        }
      ],
      parent: this.injector
    })

    if (this.events) {
      this.events.questionStaged
        .pipe(untilDestroyed(this))
        .subscribe(() => this.cdr.detectChanges())
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({})
  }
}
