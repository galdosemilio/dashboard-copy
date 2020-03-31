import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material';
import { AppDataSource } from '@coachcare/backend/model';
import { isNull, pickBy } from 'lodash';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ccr-filter-accounts',
  templateUrl: './accounts.component.html',
  providers: [{ provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }]
})
export class AccountFilterComponent implements OnInit {
  form: FormGroup;
  _isAdmin = false;
  _isLoading = true;

  @Input() source: AppDataSource<any, any, any>;

  @Output() change = new EventEmitter<any>();

  constructor(private builder: FormBuilder) {}

  ngOnInit() {
    this.setup();

    // checks if the current user is Admin
    this._isAdmin = true; // this.context.site === 'admin';
    this._isLoading = false;
  }

  setup() {
    this.form = this.builder.group({
      query: null,
      organization: null,
      includeInactive: null
    });

    this.source.addOptional(
      this.form.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged()
      ),
      () => pickBy(this.form.value, v => !isNull(v))
    );
  }
}
