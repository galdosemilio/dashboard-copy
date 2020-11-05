import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'

import {
  FoodKeyDatabase,
  FoodKeyDataSource
} from '@app/dashboard/accounts/dieters/services'

@Component({
  selector: 'app-dieter-journal-keys',
  templateUrl: 'keys.component.html',
  styleUrls: ['keys.component.scss']
})
export class FoodKeysComponent implements OnInit, OnDestroy {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }
  public source: FoodKeyDataSource
  public date$ = new BehaviorSubject<DateNavigatorOutput>({})

  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private database: FoodKeyDatabase
  ) {}

  ngOnInit() {
    this.source = new FoodKeyDataSource(this.notifier, this.database)

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      // TODO move all like these to an utility
      // adjust the unit according to the selected timeframe
      let unit
      switch (dates.timeframe) {
        case 'week':
          unit = 'day'
          break
        case 'month':
          unit = 'week'
          break
        case 'year':
        case 'alltime':
        default:
          unit = 'month'
      }
      return {
        startDate: dates.startDate,
        endDate: dates.endDate,
        organization: this.context.organization.id,
        account: this.context.account.id,
        limit: 'all',
        unit: unit
      }
    })
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
