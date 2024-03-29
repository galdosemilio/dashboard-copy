import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { MatAutocompleteSelectedEvent } from '@coachcare/material'
import { ContextService } from '@app/service/context.service'
import { FormSingle } from '@coachcare/sdk'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { debounceTime } from 'rxjs/operators'
import { FormsDatabase } from '@app/service'
import { Form } from '@app/shared/model'

@UntilDestroy()
@Component({
  selector: 'form-search',
  templateUrl: './form-search.component.html'
})
export class FormSearchComponent implements OnDestroy, OnInit {
  @Input() formId: string

  @Output()
  change: Subject<string | void> = new Subject<string | void>()

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
    void this.fetchForms()
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

  private async fetchForms(): Promise<void> {
    const response = await this.formsDatabase
      .fetch({
        organization: this.context.organization.id,
        status: 'active',
        limit: 10,
        query: this.form.controls.query.value
          ? this.form.controls.query.value.trim()
          : undefined
      })
      .toPromise()

    if (response.pagination.next) {
      this.showSearchBar = true
    }

    this.forms = response.data.map((single: FormSingle) => new Form(single))

    const selectedEntry = this.forms.find((form) => form.id === this.formId)

    if (!selectedEntry) {
      return
    }

    if (this.showSearchBar) {
      this.form.patchValue({ query: this.formId }, { emitEvent: false })
      this.formSelected = true
      this.form.controls.query.disable()
    } else {
      this.form.patchValue({ value: this.formId }, { emitEvent: false })
    }
  }
}
