import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { BindFormDirective } from '@app/shared/directives/bind-form.directive';
import { BaseQuestion, QuestionDetails } from './base.question';

@Component({
  selector: 'app-library-multiple-options-question',
  templateUrl: './multiple-options.question.component.html',
  styleUrls: ['./multiple-options.question.component.scss']
})
export class MultipleOptionsQuestionComponent extends BaseQuestion implements OnInit {
  constructor(
    formBuilder: FormBuilder,
    questionDetails: QuestionDetails,
    bindForm: BindFormDirective
  ) {
    super(bindForm, formBuilder, questionDetails);
  }

  ngOnInit(): void {
    super.ngOnInit();
    if (this.readonly) {
      this.form.controls.value.disable();
    }
  }
}
