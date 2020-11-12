import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { BehaviorSubject } from 'rxjs'

import {
  LevlDatabase,
  LevlDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'

@Component({
  selector: 'app-levl-table',
  templateUrl: './levl-table.component.html',
  styleUrls: ['./levl-table.component.scss']
})
export class LevlTableComponent implements OnInit {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }
  @Input() columns = ['date', 'acetonePpm']
  @Input() source: LevlDataSource

  date$ = new BehaviorSubject<DateNavigatorOutput>({})

  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private database: LevlDatabase,
    private translator: TranslateService
  ) {}

  ngOnInit() {
    this.source = new LevlDataSource(
      this.notifier,
      this.database,
      this.translator
    )

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        account: this.context.accountId,
        data: ['acetonePpm'],
        startDate: dates.startDate,
        endDate: dates.endDate,
        unit: 'day'
      }
    })
  }
}
