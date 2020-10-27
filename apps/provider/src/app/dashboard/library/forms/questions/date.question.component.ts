import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BindFormDirective } from '@app/shared/directives/bind-form.directive';
import { BaseQuestion, QuestionDetails } from './base.question';

@Component({
  selector: 'app-library-question-date',
  templateUrl: './date.question.component.html'
})
export class DateQuestionComponent extends BaseQuestion {
  constructor(
    bindForm: BindFormDirective,
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails
  ) {
    super(bindForm, formBuilder, questionDetails);
  }
}
