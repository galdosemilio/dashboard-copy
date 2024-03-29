import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AppDataSource } from '@coachcare/backend/model'
// import { ContextService } from '@coachcare/common/services';
import { isNull, pickBy } from 'lodash'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

@Component({
  selector: 'ccr-filter-organizations',
  templateUrl: './organizations.component.html'
})
export class OrganizationsFilterComponent implements OnInit {
  form: FormGroup
  _isAdmin = false
  _isLoading = true

  @Input() source: AppDataSource<any, any, any>

  @Output() change = new EventEmitter<any>()

  constructor(
    private builder: FormBuilder /*, private context: ContextService*/
  ) {}

  ngOnInit() {
    this.setup()

    // checks if the current user is Admin
    this._isAdmin = true // this.context.site === 'admin';
    this._isLoading = false
  }

  setup() {
    this.form = this.builder.group({
      name: null,
      status: 'active'
    })

    this.source.addOptional(
      this.form.valueChanges.pipe(debounceTime(500), distinctUntilChanged()),
      () => pickBy(this.form.value, (v) => !isNull(v))
    )
  }
}
