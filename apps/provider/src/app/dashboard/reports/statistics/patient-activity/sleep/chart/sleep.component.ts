import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'

import {
  ReportsCriteria,
  SleepDataSource,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector } from '@app/dashboard/reports/store'
import { ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, NotifierService } from '@app/service'
import { ChartData } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-statistics-sleep-chart',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.scss'],
  host: { class: 'ccr-chart' }
})
export class SleepChartComponent implements OnInit, AfterViewInit, OnDestroy {
  source: SleepDataSource | null
  chart: ChartData

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new SleepDataSource(this.notifier, this.database)

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data
        ? moment(this.data.startDate).format('YYYY-MM-DD')
        : null,
      endDate: this.data
        ? moment(this.data.endDate).format('YYYY-MM-DD')
        : null,
      unit: 'day',
      limit: 'all'
    }))

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.chart = undefined // force refresh on change
        setTimeout(() => {
          this.chart = {}
          merge(this.chart, this.config.get('chart').factory('bar'), chart)
        }, 50)
      })

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })

    // TODO listen org changes to reload colors
  }

  ngAfterViewInit() {
    if (!this.source.isLoaded) {
      this.refresh$.next()
      this.cdr.detectChanges()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
