import { Directive, Injectable, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { FormQuestion } from '@app/dashboard/library/forms/models'
import { BindForm, BindFormDirective } from '@app/shared/directives'
import { FormAnswer } from '@coachcare/sdk'
import * as linkifyHtml from 'linkifyjs/html'

@Injectable()
export class QuestionDetails {
  public answer: FormAnswer
  public question: FormQuestion
  public readonly: boolean

  constructor(args: QuestionDetails) {
    this.answer = args.answer
    this.question = args.question
    this.readonly = args.readonly || false
  }
}

@Directive()
export class BaseQuestion implements BindForm, OnInit {
  public answer: FormAnswer
  public form: FormGroup
  public question: FormQuestion
  public readonly = false

  constructor(
    protected bindForm: BindFormDirective,
    protected formBuilder: FormBuilder,
    protected questionDetails: QuestionDetails
  ) {}

  ngOnInit(): void {
    this.answer = this.questionDetails.answer
    this.question = this.questionDetails.question
    this.readonly = this.questionDetails.readonly
    this.createForm()

    if (!this.readonly) {
      this.bindForm.setControl(this.form)
    }
  }

  private createForm(): void {
    this.form = this.formBuilder.group({
      value: ['', this.question.isRequired ? Validators.required : []]
    })

    if (this.answer) {
      this.form.patchValue({ value: this.answer.response.value })
    }
  }

  protected parseTextElements(answer: string): string {
    const parsedAnswer = answer.replace(new RegExp('\n', 'g'), '<br>')
    return linkifyHtml(parsedAnswer, { target: '_blank' })
  }
}
