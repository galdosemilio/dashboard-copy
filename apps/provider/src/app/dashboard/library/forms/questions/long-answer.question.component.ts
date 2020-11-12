import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { BindFormDirective } from '@app/shared/directives/bind-form.directive'
import { BaseQuestion } from './base.question'
import { QuestionDetails } from './base.question'

@Component({
  selector: 'app-library-long-answer-question',
  templateUrl: './long-answer.question.component.html',
  styleUrls: ['./long-answer.question.component.scss']
})
export class LongAnswerQuestionComponent extends BaseQuestion
  implements OnInit {
  parsedValue: string

  constructor(
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails,
    bindForm: BindFormDirective
  ) {
    super(bindForm, formBuilder, questionDetails)
  }

  ngOnInit(): void {
    super.ngOnInit()

    if (this.readonly) {
      this.parsedValue = this.parseTextElements(this.form.value.value)
    }
  }
}
