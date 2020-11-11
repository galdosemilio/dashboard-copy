import { Component, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@coachcare/material'
import { Form } from '@app/dashboard/library/forms/models/form.model'
import { FormsDatabase } from '@app/dashboard/library/forms/services/forms.database'
import { ContextService } from '@app/service/context.service'
import { FormSingle, GetAllFormResponse } from '@coachcare/npm-api'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'form-search',
  templateUrl: './form-search.component.html'
})
export class FormSearchComponent implements OnDestroy, OnInit {
  @Output()
  change: Subject<string> = new Subject<string>()

  form: FormGroup
  forms: any[]
  formSelected = false
  showSearchBar: boolean

  constructor(
    private context: ContextService,
    private formsDatabase: FormsDatabase,
    private fb: FormBuilder
  ) {}

  ngOnDestroy() {}

  ngOnInit() {
    this.createForm()
    this.fetchForms()
  }

  onFormAutocompleteSelect($event: MatAutocompleteSelectedEvent) {
    this.formSelected = !!$event.option.value
    this.form.controls.query.disable()
    this.change.next($event.option.value || undefined)
  }

  onFormSelect($event: any) {
    this.change.next($event.value || undefined)
  }

  resetSearchBar() {
    this.formSelected = false
    this.form.controls.query.enable()
    this.form.controls.query.reset()
    this.change.next()
  }

  searchBarDisplayWith(value: any): string {
    const selectedForm: Form =
      this.forms && this.forms.length
        ? this.forms.find((form: Form) => form.id === value)
        : undefined
    return selectedForm ? selectedForm.name : value
  }

  private createForm() {
    this.form = this.fb.group({
      query: [''],
      value: []
    })
    this.form.controls.query.valueChanges
      .pipe(untilDestroyed(this))
      .pipe(debounceTime(500))
      .subscribe(() => this.fetchForms())
  }

  private fetchForms() {
    this.formsDatabase
      .fetch({
        organization: this.context.organization.id,
        status: 'active',
        limit: 10,
        query: this.form.controls.query.value
          ? this.form.controls.query.value.trim()
          : undefined
      })
      .subscribe((response: GetAllFormResponse) => {
        if (response.pagination.next) {
          this.showSearchBar = true
        }
        this.forms = response.data.map((single: FormSingle) => new Form(single))
      })
  }
}
