import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { merge } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject } from 'rxjs'

import {
  LevlDatabase,
  LevlDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { ChartData, DateNavigatorOutput } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-levl-chart',
  templateUrl: './levl-chart.component.html',
  styleUrls: ['./levl-chart.component.scss'],
  host: { class: 'ccr-chart' }
})
export class LevlChartComponent implements OnInit, OnDestroy {
  @Input()
  source: LevlDataSource | null
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }
  date$ = new BehaviorSubject<DateNavigatorOutput>({})
  chart: ChartData

  constructor(
    private context: ContextService,
    private config: ConfigService,
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

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.chart = undefined // force refresh on change
        setTimeout(() => {
          this.chart = {}
          merge(this.chart, this.config.get('chart').factory('line'), chart)
        }, 50)
      })
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
