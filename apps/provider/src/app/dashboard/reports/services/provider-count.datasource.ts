import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { from, Observable, of } from 'rxjs'

import { NotifierService } from '@app/service'
import { _, ChartData, ChartDataSource, TranslationsObject } from '@app/shared'
import { ProviderCountRequest, ProviderCountSegment } from '@coachcare/npm-api'
import { StatisticsDatabase } from './'

export class ProviderCountDataSource extends ChartDataSource<
  ProviderCountSegment,
  ProviderCountRequest
> {
  translations: TranslationsObject

  constructor(
    protected notify: NotifierService,
    protected database: StatisticsDatabase,
    private translator: TranslateService
  ) {
    super()

    // translatable labels
    this.buildTranslations()
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.buildTranslations()
      })
  }

  disconnect() {}

  private buildTranslations() {
    this.translator
      .get([_('REPORTS.PROVIDERS')])
      .subscribe((translations) => (this.translations = translations))
  }

  defaultFetch(): Array<ProviderCountSegment> {
    return []
  }

  fetch(
    criteria: ProviderCountRequest
  ): Observable<Array<ProviderCountSegment>> {
    return criteria.organization
      ? from(this.database.fetchProviderCount(criteria))
      : of(this.defaultFetch())
  }

  mapResult(result: Array<ProviderCountSegment>): Array<ProviderCountSegment> {
    if (!result || !result.length) {
      return []
    }
    return result
  }

  mapChart(result: Array<ProviderCountSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    const data = result.map((v) => ({
      date: v.date,
      sum: v.aggregates.reduce((acc, obj) => acc + obj.count, 0)
    }))

    // formats
    const endDate = moment(this.criteria.endDate)
    const currentDate = moment(this.criteria.startDate)

    let xlabelFormat
    let tooltipFormat
    switch (this.args.unit) {
      case 'day':
        xlabelFormat =
          endDate.month() !== currentDate.month() ? 'MMM D' : 'ddd D'
        tooltipFormat = 'ddd, MMM D'
        break
      case 'week':
        xlabelFormat = 'MMM D'
        tooltipFormat = 'MMM D, YYYY'
        break
      case 'month':
        xlabelFormat = 'MMM YYYY'
        tooltipFormat = 'MMM YYYY'
        break
    }

    const max = data
      .map((v) => v.sum)
      .reduce((prev, curr) => (prev > curr ? prev : curr), 0)

    const chart: ChartData = {
      type: 'bar',
      datasets: [
        {
          label: () => this.translations['REPORTS.PROVIDERS'],
          data: data.map((v) => v.sum)
        }
      ],
      labels: data.map((v) => v.date),
      options: {
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index
              return moment(d.labels[i]).format(tooltipFormat)
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.datasetIndex
              const label = d.datasets[i].label()
              return label + ': ' + tooltipItem.yLabel
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                max: Math.ceil(max * 1.1),
                callback: function (value, index, values) {
                  return !index || index === values.length - 1
                    ? ''
                    : Math.floor(value) === value
                    ? value
                    : ''
                }
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return moment(value).format(xlabelFormat)
                }
              }
            }
          ]
        }
      }
    }

    return chart
  }
}
