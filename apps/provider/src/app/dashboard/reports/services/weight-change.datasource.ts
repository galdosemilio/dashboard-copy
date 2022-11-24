import { MatPaginator, MatSort } from '@coachcare/material'
import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, Observable, of } from 'rxjs'

import {
  SortDirection,
  WeightChangeOrder
} from '@app/dashboard/reports/services'
import { NotifierService } from '@app/service'
import { _, TranslationsObject } from '@app/shared/utils'
import { ChartData, ChartDataSource } from '@app/shared/model'
import {
  WeightChangeRequest,
  WeightChangeResponse,
  WeightChangeSegment
} from '@coachcare/sdk'
import { StatisticsDatabase } from './statistics.database'

@UntilDestroy()
export class WeightChangeDataSource extends ChartDataSource<
  WeightChangeSegment,
  WeightChangeRequest
> {
  i18n: TranslationsObject

  constructor(
    protected notify: NotifierService,
    protected database: StatisticsDatabase,
    private translator: TranslateService,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super()

    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }

    if (this.sort) {
      this.addOptional(this.sort.sortChange, () => ({
        sort: [
          {
            property: this.sort.active
              ? (this.sort.active as WeightChangeOrder)
              : 'percentage',
            dir: (this.sort.direction as SortDirection) || 'asc'
          }
        ]
      }))
    }

    // factors with translatable units
    this.buildFormatter()
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.buildFormatter()
      })
  }

  disconnect() {}

  private buildFormatter() {
    // TODO use the conversion pipes inside this class
    this.translator
      .get([_('UNIT.KG'), _('UNIT.LB'), _('UNIT.LBS')])
      .subscribe((translations) => {
        this.i18n = translations
        // setup the label formatters
        this.formatters = {
          weight: [() => translations['UNIT.LBS'], (v) => v, true]
        }
      })
  }

  defaultFetch(): WeightChangeResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: WeightChangeRequest): Observable<WeightChangeResponse> {
    return criteria.organization
      ? from(this.database.fetchWeightChange(criteria))
      : of(this.defaultFetch())
  }

  mapResult(result: WeightChangeResponse): Array<WeightChangeSegment> {
    if (!result || !result.data.length) {
      return []
    }

    this.total = this.getTotal(result)

    return result.data
  }

  // FIXME not working with unit preferences nor i18n
  mapChart(result: Array<WeightChangeSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    // TODO select value or percentage
    // TODO need to put a control to select 'value' | 'percentage' in component
    const metric = 'value'

    const format = (measurement, value) => {
      const c = this.formatters[measurement]
      return c[1](value)
    }

    const data =
      metric === 'value'
        ? result.map((v) => format('weight', v.change[metric]))
        : result.map((v) => v.change.percentage)

    const labels = result.map((v) => v.account.lastName)
    const fullNames = result.map(
      (v) => v.account.lastName + ' ' + v.account.firstName
    )

    const chart: ChartData = {
      type: 'bar',
      datasets: [
        {
          data: data,
          fullNames: fullNames,
          chartWidth: data.length * 20
        }
      ],
      labels: labels,
      options: {
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              return 'Name: ' + d.datasets[0].fullNames[tooltipItem[0].index]
            },
            label: (tooltipItem, d) => {
              const unit =
                metric === 'value'
                  ? this.formatters['weight'][0](tooltipItem.yLabel)
                  : '%'
              return 'Weight Change: ' + tooltipItem.yLabel + ' ' + unit
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function (value, index, values) {
                  // display only when whole number
                  return Math.floor(value) === value ? value : ''
                }
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
              }
            }
          ]
        }
      }
    }

    return chart
  }
}
