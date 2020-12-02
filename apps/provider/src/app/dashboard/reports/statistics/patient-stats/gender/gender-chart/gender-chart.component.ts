import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core'
import { merge } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

import { GenderDataSource } from '@app/dashboard/reports/services'
import { ConfigService, ContextService } from '@app/service'
import { ChartData } from '@app/shared'

@UntilDestroy()
@Component({
  selector: 'app-statistics-gender-chart',
  templateUrl: './gender-chart.component.html',
  styleUrls: ['./gender-chart.component.scss'],
  host: { class: 'ccr-chart' }
})
export class GenderChartComponent implements OnInit, OnDestroy {
  @Input()
  source: GenderDataSource | null

  chart: ChartData
  timeout: any

  constructor(
    private cdr: ChangeDetectorRef,
    private config: ConfigService,
    private context: ContextService
  ) {}

  ngOnInit() {
    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.refresh(chart)
      })

    this.context.organization$.pipe(untilDestroyed(this)).subscribe((org) => {
      if (this.source.isLoaded && org.id) {
        this.refresh(this.source.cdata)
      }
    })

    this.cdr.detectChanges()
  }

  ngOnDestroy() {}

  refresh(data: ChartData) {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.chart = undefined // force refresh on change
    this.timeout = setTimeout(() => {
      this.chart = {}
      merge(this.chart, this.config.get('chart').factory('pie'), data)
    }, 500)
  }
}
