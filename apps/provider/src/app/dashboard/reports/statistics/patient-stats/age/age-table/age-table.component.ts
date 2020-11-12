import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core'
import * as moment from 'moment-timezone'

import { AgeDataSource } from '@app/dashboard/reports/services'

@Component({
  selector: 'app-statistics-age-table',
  templateUrl: './age-table.component.html',
  styleUrls: ['./age-table.component.scss']
})
export class AgeTableComponent implements OnInit {
  @Input() source: AgeDataSource

  columns = ['age-class', 'count', 'percentage']

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.cdr.detectChanges()
  }
}
