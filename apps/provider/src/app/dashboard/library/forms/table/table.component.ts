import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sort } from '@coachcare/common/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Form } from '@app/dashboard/library/forms/models';
import { FormsDatasource } from '@app/dashboard/library/forms/services';

@Component({
  selector: 'app-library-forms-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class FormsTableComponent {
  @Input()
  datasource: FormsDatasource;

  @Output()
  onDelete: EventEmitter<Form> = new EventEmitter<Form>();
  @Output()
  onEdit: EventEmitter<Form> = new EventEmitter<Form>();
  @Output()
  onSorted: EventEmitter<Sort> = new EventEmitter<Sort>();

  public columns = [
    'name',
    'isActive',
    'addendum',
    'maximumSubmissions',
    'actions',
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  onDisplayForm(form: Form): void {
    this.router.navigate([form.id], { relativeTo: this.route });
  }

  onDeleteForm(form: Form): void {
    this.onDelete.emit(form);
  }

  onFillForm(form: Form): void {
    this.router.navigate([form.id, 'fill'], { relativeTo: this.route });
  }

  onShowForm(form: Form): void {
    if (form.isAdmin) {
      this.router.navigate([form.id, 'edit'], { relativeTo: this.route });
    }
  }

  onViewFormSubmissions(form: Form): void {
    this.router.navigate([form.id, 'submissions'], { relativeTo: this.route });
  }

  onSort(sort: Sort): void {
    this.onSorted.emit(sort);
  }

  onEditName(form: Form) {
    if (form.isAdmin) {
      this.onEdit.emit(form);
    }
  }
}
