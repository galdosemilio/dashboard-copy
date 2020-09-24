import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@coachcare/layout';
import { AppDataSource } from '@coachcare/backend/model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ccr-filter-labels',
  templateUrl: './labels.component.html',
  providers: [
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'auto' } }
  ]
})
export class LabelsFilterComponent implements OnInit {
  form: FormGroup;
  _isLoading = true;

  @Input() source: AppDataSource<any, any, any>;

  @Output() change = new EventEmitter<any>();

  constructor(
    private builder: FormBuilder /*, private context: ContextService*/
  ) {}

  ngOnInit() {
    this.setup();

    // checks if the current user is Admin
    this._isLoading = false;
  }

  setup() {
    this.form = this.builder.group({
      includeInActive: null
    });

    this.source.addOptional(
      this.form.valueChanges.pipe(debounceTime(500), distinctUntilChanged()),
      () => ({ isActive: this.form.value.includeInActive ? undefined : true })
    );
  }
}
