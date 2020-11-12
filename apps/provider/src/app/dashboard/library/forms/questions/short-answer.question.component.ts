import { Component, OnInit } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import {
  BaseQuestion,
  QuestionDetails
} from '@app/dashboard/library/forms/questions/base.question'
import { BindFormDirective } from '@app/shared/directives/bind-form.directive'

@Component({
  selector: 'app-library-short-answer-question',
  templateUrl: './short-answer.question.component.html',
  styleUrls: ['./short-answer.question.component.scss']
})
export class ShortAnswerQuestionComponent extends BaseQuestion
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
