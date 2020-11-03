import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { PainDataSource } from '@app/dashboard/accounts/dieters/services';

@Component({
  selector: 'app-dieter-journal-pain-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class PainTableComponent implements OnInit {
  @Input()
  columns = ['date', 'details'];
  @Input()
  source: PainDataSource | null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges();
  }
}
