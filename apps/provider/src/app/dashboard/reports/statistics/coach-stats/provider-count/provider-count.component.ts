import { Component, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'

import {
  ProviderCountDataSource,
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { ChartData } from '@app/shared'
import { TimelineUnit } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'app-statistics-provider-count',
  templateUrl: './provider-count.component.html',
  styleUrls: ['./provider-count.component.scss'],
  host: { class: 'ccr-chart' }
})
export class ProviderCountComponent implements OnInit, OnDestroy {
  source: ProviderCountDataSource | null
  chart: ChartData

  // subscription for selector changes
  data: ReportsCriteria
  timeout: any

  // refresh trigger
  private refresh$ = new Subject<void>()

  constructor(
    private translator: TranslateService,
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new ProviderCountDataSource(
      this.notifier,
      this.database,
      this.translator
    )

    this.source.addRequired(this.refresh$, () => {
      let unit: TimelineUnit
      switch (true) {
        case this.data.diff > 30 * 6:
          // > 6 months
          unit = 'month'
          break
        case this.data.diff > 7 * 5:
          // > 5 weeks
          unit = 'week'
          break
        default:
          unit = 'day'
      }

      return {
        organization: this.data ? this.data.organization : null,
        startDate: this.data
          ? moment(this.data.startDate).format('YYYY-MM-DD')
          : null,
        endDate: this.data
          ? moment(this.data.endDate).format('YYYY-MM-DD')
          : null,
        mode: 'detailed',
        unit
      }
    })

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.refresh(chart)
      })

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      if (
        this.data &&
        this.source.isLoaded &&
        !this.source.isLoading &&
        org.id
      ) {
        this.refresh(this.source.cdata)
      }
    })
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  refresh(data: ChartData) {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.chart = undefined // force refresh on change
    this.timeout = setTimeout(() => {
      this.chart = {}
      merge(this.chart, this.config.get('chart').factory('bar'), data)
    }, 500)
  }
}
