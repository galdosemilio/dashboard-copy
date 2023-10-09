import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import Papa from 'papaparse'

import {
  ReportsCriteria,
  ReportsDatabase,
  SignupsReportsDataSource
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { ViewUtils } from '@app/shared'
import { TimelineUnit } from '@coachcare/sdk'
import { delay } from 'rxjs/operators'
import { CSV } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'app-reports-signups',
  templateUrl: './signups.component.html'
})
export class SignupsComponent implements OnInit, AfterViewInit, OnDestroy {
  source: SignupsReportsDataSource

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  private refresh$ = new Subject<void>()

  constructor(
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: ReportsDatabase,
    private translator: TranslateService,
    private viewUtils: ViewUtils,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new SignupsReportsDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.config,
      this.viewUtils
    )

    this.source.addRequired(this.refresh$, () => {
      let unit: TimelineUnit
      switch (true) {
        case this.data.diff > 30 * 6:
          // ~60 bars
          unit = 'month'
          break
        case this.data.diff > 7 * 5:
          // +-62 bars
          unit = 'week'
          break
        default:
          // < 62 bars
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
        unit
      }
    })
  }

  ngAfterViewInit() {
    this.context.organization$
      .pipe(untilDestroyed(this), delay(1))
      .subscribe((org) => {
        if (this.data && org.id) {
          this.refresh$.next()
        }
      })

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector), delay(1))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })
  }

  ngOnDestroy() {}

  downloadCSV() {
    const data = this.source.cdata

    const format = 'YYYY-MM-DD' // FIXME figure according the date-range
    const dates = data.datasets[0].data.filter((d) => d.x).map((d) => d.x)
    const ini = moment(dates[0]).format(format)
    const end = moment(dates[dates.length - 1]).format(format)
    const orgName = data.datasets[data.datasets.length - 1].label
    const filename = `${orgName}_signups_${dates[0]}_${
      dates[dates.length - 1]
    }.csv`

    // english only file
    let csv = ''
    csv += 'PATIENT ENGAGEMENT\r\n'
    csv += `${ini} - ${end}` + '\r\n'

    const csvData = data.datasets.map((dataset) => ({
      Signups: dataset.label,
      ...dataset.data.reduce(
        (prev, current) => ({
          ...prev,
          [current.x]: [current.y]
        }),
        {}
      )
    }))

    csv += Papa.unparse(csvData)

    CSV.toFile({
      content: csv,
      filename: filename
    })
  }
}
