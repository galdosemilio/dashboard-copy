import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { merge } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import {
  ReportsCriteria,
  SignupsReportsDataSource
} from '@app/dashboard/reports/services'
import { ConfigService } from '@app/service'
import { ChartData } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-reports-signups-chart',
  templateUrl: './signups-chart.component.html',
  styleUrls: ['./signups-chart.component.scss'],
  host: { class: 'ccr-chart' }
})
export class SignupsChartComponent implements OnInit, OnDestroy {
  @Input()
  source: SignupsReportsDataSource

  chart: ChartData

  // subscription for selector changes
  data: ReportsCriteria
  timeout: any

  constructor(private config: ConfigService) {}

  ngOnInit() {
    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.refresh(chart)
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
