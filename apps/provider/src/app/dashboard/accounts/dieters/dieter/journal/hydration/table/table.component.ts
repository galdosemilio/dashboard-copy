import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { HydrationDataSource } from '@app/dashboard/accounts/dieters/services';

@Component({
  selector: 'app-dieter-journal-hydration-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class HydrationTableComponent implements OnInit {
  @Input() columns = ['date', 'amount', 'dailygoal'];
  @Input() source: HydrationDataSource | null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
