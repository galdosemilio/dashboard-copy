import { Component, OnDestroy, OnInit } from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty, merge } from 'lodash'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'
import * as tinycolor from 'tinycolor2'

import {
  ReportsCriteria,
  StatisticsDatabase,
  StepsDataSource
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ConfigService, ContextService, NotifierService } from '@app/service'
import { _, ChartData, TranslationsObject } from '@app/shared'

@Component({
  selector: 'app-statistics-steps-chart',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
  host: { class: 'ccr-chart' }
})
export class StepsChartComponent implements OnInit, OnDestroy {
  source: StepsDataSource | null
  chart: ChartData

  // subscription for selector changes
  data: ReportsCriteria
  timeout: any
  csvSeparator = ','

  // refresh trigger
  refresh$ = new Subject<void>()

  translations: TranslationsObject

  constructor(
    private translator: TranslateService,
    private config: ConfigService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    // factors with translatable units
    this.translator.onLangChange.pipe(untilDestroyed(this)).subscribe(() => {
      this.buildTranslations()
    })

    this.source = new StepsDataSource(
      this.notifier,
      this.database,
      this.translator
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data
        ? moment(this.data.startDate).format('YYYY-MM-DD')
        : null,
      endDate: this.data
        ? moment(this.data.endDate).format('YYYY-MM-DD')
        : null,
      level: [
        { name: this.translations['LEVEL.LOW'], threshold: 0 },
        { name: this.translations['LEVEL.MODERATE'], threshold: 4000 },
        { name: this.translations['LEVEL.ACCEPTABLE'], threshold: 5000 },
        { name: this.translations['LEVEL.EXCELLENT'], threshold: 10000 }
      ],
      limit: 'all'
    }))

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
          this.buildTranslations()
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
      const colors = ['#f2dede', '#faf2cc', '#d9edf7', '#d0e9c6']
      merge(this.chart, this.config.get('chart').factory('bar'), data, {
        colors: [
          {
            backgroundColor: colors,
            hoverBackgroundColor: colors.map((c) =>
              tinycolor(c).darken().toString()
            )
          }
        ]
      })
    }, 500)
  }

  private buildTranslations() {
    this.translator
      .get([
        _('LEVEL.LOW'),
        _('LEVEL.MODERATE'),
        _('LEVEL.ACCEPTABLE'),
        _('LEVEL.EXCELLENT')
      ])
      .subscribe((translations) => {
        this.translations = translations
        this.refresh$.next()
      })
  }

  downloadCSV() {
    const space = ''
    const criteria = this.source.args
    this.database.fetchActivityLevel(criteria).then((res) => {
      const format = 'YYYY-MM-DD'
      const filename = `Patient_Steps_${criteria.startDate}_${criteria.endDate}.csv`
      let csv = ''
      csv += 'PATIENT STEPS REPORT\r\n'
      csv +=
        'Patient ID' +
        this.csvSeparator +
        'First Name' +
        this.csvSeparator +
        'Last Name' +
        this.csvSeparator +
        'Level' +
        this.csvSeparator +
        'Organization ID' +
        this.csvSeparator +
        'Organization Name' +
        this.csvSeparator +
        'Steps Avg' +
        this.csvSeparator +
        'Steps Max' +
        this.csvSeparator +
        'Steps Min' +
        this.csvSeparator +
        'Steps Sample Count' +
        this.csvSeparator +
        'Provider ID' +
        this.csvSeparator +
        'Provider First Name' +
        this.csvSeparator +
        'Provider Last Name' +
        '\r\n'
      res.forEach((d) => {
        csv +=
          d.account.id +
          this.csvSeparator +
          d.account.firstName +
          this.csvSeparator +
          d.account.lastName +
          this.csvSeparator +
          d.level.name +
          this.csvSeparator +
          d.organization.id +
          this.csvSeparator +
          d.organization.name +
          this.csvSeparator +
          d.steps.avg +
          this.csvSeparator +
          d.steps.max +
          this.csvSeparator +
          d.steps.min +
          this.csvSeparator +
          d.steps.sampleCount
        if (d.assignedProvider) {
          csv +=
            this.csvSeparator +
            d.assignedProvider.id +
            this.csvSeparator +
            d.assignedProvider.firstName +
            this.csvSeparator +
            d.assignedProvider.lastName
        }
        csv += '\r\n'
      })
      const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.setAttribute('visibility', 'hidden')
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
  }
}
