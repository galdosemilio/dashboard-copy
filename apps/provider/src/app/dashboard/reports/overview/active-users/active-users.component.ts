import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'

import {
  ActiveUsersDataSource,
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { ChartData } from '@app/shared'
import { TimelineUnit } from '@coachcare/sdk'

@UntilDestroy()
@Component({
  selector: 'app-reports-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.scss'],
  host: { class: 'ccr-chart' }
})
export class ActiveUsersComponent implements OnInit, OnDestroy {
  source: ActiveUsersDataSource | null
  chart: ChartData

  // subscription for selector changes
  data: ReportsCriteria
  timeout: any

  hint: any = {}

  // refresh trigger
  private refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private database: StatisticsDatabase,
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new ActiveUsersDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.config
    )

    this.source.addDefault({
      startDate: moment()
        .subtract(12, 'months')
        .startOf('month')
        .format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
      unit: 'month'
    })

    this.source.addRequired(this.refresh$, () => {
      const data = {
        startDate: this.data.startDate,
        endDate: this.data.endDate,
        unit: 'month'
      }

      // FIXME this is not translated onLangChange
      const today = moment()
      this.hint = {
        month: today.format('MMM YYYY'),
        first: today.startOf('month').format('MMM D'),
        diff: moment().diff(today, 'days') + 1
      }

      // let unit: TimelineUnit;
      // switch (true) {
      //   case this.data.diff > 7 * 7:
      //     // > 7 weeks
      //     unit = 'month';
      //     break;
      //   case this.data.diff > 7 * 2:
      //     // > 14 days
      //     unit = 'week';
      //     break;
      //   default:
      //     unit = 'day';
      // }

      return {
        organization: this.data ? this.data.organization : null,
        startDate: data.startDate,
        endDate: data.endDate,
        detailed: true,
        limit: 'all',
        unit: data.unit as TimelineUnit
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

    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      if (this.data && this.source.isLoaded && !this.source.isLoading) {
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
