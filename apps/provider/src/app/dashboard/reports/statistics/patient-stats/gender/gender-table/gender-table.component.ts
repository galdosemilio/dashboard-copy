import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { GenderDataSource } from '@app/dashboard/reports/services';

@Component({
  selector: 'app-statistics-gender-table',
  templateUrl: './gender-table.component.html',
  styleUrls: ['./gender-table.component.scss']
})
export class GenderTableComponent implements OnInit {
  columns = ['gender', 'count', 'percentage'];
  @Input() source: GenderDataSource | null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
