import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject } from 'rxjs'

import {
  FoodData,
  FoodDatabase,
  FoodDataSource
} from '@app/dashboard/accounts/dieters/services'
import { responsiveSelector, UIResponsiveState } from '@app/layout/store'
import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import * as moment from 'moment'

@UntilDestroy()
@Component({
  selector: 'app-dieter-journal-food',
  templateUrl: 'food.component.html',
  styleUrls: ['food.component.scss']
})
export class FoodComponent implements OnInit, OnDestroy {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }

  source: FoodDataSource | null

  date$ = new BehaviorSubject<DateNavigatorOutput>({})
  data = new FoodData()
  cols: number

  constructor(
    private responsive: Store<UIResponsiveState>,
    private context: ContextService,
    private notifier: NotifierService,
    private database: FoodDatabase
  ) {}

  ngOnInit() {
    this.source = new FoodDataSource(this.notifier, this.database)
    this.source.addDefault({
      account: +this.context.accountId,
      noLimit: true
    })
    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        startDate: moment(dates.startDate).toISOString(),
        endDate: moment(dates.endDate).endOf('day').toISOString()
      }
    })

    this.source.stat$.pipe(untilDestroyed(this)).subscribe((stats) => {
      this.data = stats
    })

    this.responsive
      .pipe(untilDestroyed(this), select(responsiveSelector))
      .subscribe((state) => (this.cols = state.columns))
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
