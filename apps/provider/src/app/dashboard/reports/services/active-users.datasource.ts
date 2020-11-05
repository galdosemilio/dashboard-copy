import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { from, Observable, of } from 'rxjs'
import * as tinycolor from 'tinycolor2'

import { ConfigService, NotifierService } from '@app/service'
import { _, ChartData, ChartDataSource, TranslationsObject } from '@app/shared'
import {
  OrganizationActivityAggregate,
  OrganizationActivityRequest
} from '@coachcare/npm-api'
import { StatisticsDatabase } from './statistics.database'

export class ActiveUsersDataSource extends ChartDataSource<
  OrganizationActivityAggregate,
  OrganizationActivityRequest
> {
  translations: TranslationsObject

  constructor(
    protected notify: NotifierService,
    protected database: StatisticsDatabase,
    private translator: TranslateService,
    private config: ConfigService
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
      .get([
        _('REPORTS.INACTIVE_CLIENTS'),
        _('REPORTS.ACTIVE_CLIENTS'),
        _('REPORTS.INACTIVE_PROVIDERS'),
        _('REPORTS.ACTIVE_PROVIDERS')
      ])
      .subscribe((translations) => (this.translations = translations))
  }

  defaultFetch(): Array<OrganizationActivityAggregate> {
    return []
  }

  fetch(
    criteria: OrganizationActivityRequest
  ): Observable<Array<OrganizationActivityAggregate>> {
    return criteria.organization
      ? from(this.database.fetchOrganizationActivity(criteria))
      : of([])
  }

  mapResult(
    result: Array<OrganizationActivityAggregate>
  ): Array<OrganizationActivityAggregate> {
    if (!result || !result.length) {
      return []
    }
    return result
  }

  mapChart(result: Array<OrganizationActivityAggregate>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    const uniqueDates = result
      .map((v) => v.date)
      .filter((v, i, s) => s.indexOf(v) === i)

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

    const data = {
      totalClients: [],
      activeClients: [],
      inactiveClients: [],
      activeClientsPercent: [],
      inactiveClientsPercent: [],

      totalProviders: [],
      activeProviders: [],
      inactiveProviders: [],
      activeProvidersPercent: [],
      inactiveProvidersPercent: []
    }

    let max
    const totals = uniqueDates.forEach((date) => {
      let totalClients = 0
      let activeClients = 0
      let totalProviders = 0
      let activeProviders = 0

      result
        .filter((v, i, s) => v.date === date)
        .forEach((v, i) => {
          totalClients = v.clients.total + totalClients
          activeClients = v.clients.active + activeClients
          totalProviders = v.providers.total + totalProviders
          activeProviders = v.providers.active + activeProviders
        })

      data.totalClients.push(totalClients)
      data.activeClients.push(activeClients)
      data.inactiveClients.push(totalClients - activeClients)
      data.activeClientsPercent.push((activeClients / totalClients) * 100)
      data.inactiveClientsPercent.push(
        100 - (activeClients / totalClients) * 100
      )

      data.totalProviders.push(totalProviders)
      data.activeProviders.push(activeProviders)
      data.inactiveProviders.push(totalProviders - activeProviders)
      data.activeProvidersPercent.push((activeProviders / totalProviders) * 100)
      data.inactiveProvidersPercent.push(
        100 - (activeProviders / totalProviders) * 100
      )

      const higher = Math.max(totalProviders, totalClients)
      max = !max || higher > max ? Math.ceil(higher) : max
    })

    const barChartData = [
      {
        label: this.translations['REPORTS.INACTIVE_CLIENTS'],
        stack: 'stack0',
        data: data.inactiveClients,
        visible: false
      },
      {
        label: this.translations['REPORTS.ACTIVE_CLIENTS'],
        stack: 'stack0',
        data: data.activeClients,
        visible: true
      },
      {
        label: this.translations['REPORTS.INACTIVE_PROVIDERS'],
        stack: 'stack1',
        data: data.inactiveProviders,
        visible: false
      },
      {
        label: this.translations['REPORTS.ACTIVE_PROVIDERS'],
        stack: 'stack1',
        data: data.activeProviders,
        visible: true
      }
    ]

    const barChartColors = [
      {
        backgroundColor: this.config.get('colors').get(0),
        hoverBackgroundColor: tinycolor(this.config.get('colors').get(0))
          .darken()
          .toString()
      },
      {
        backgroundColor: this.config.get('colors').get(1),
        hoverBackgroundColor: tinycolor(this.config.get('colors').get(1))
          .darken()
          .toString()
      },
      {
        backgroundColor: '#dfdfdf',
        hoverBackgroundColor: tinycolor('#dfdfdf').darken().toString()
      },
      {
        backgroundColor: '#ababab',
        hoverBackgroundColor: tinycolor('#ababab').darken().toString()
      }
    ]

    const totalizer = {
      id: 'totalizer',

      beforeUpdate: (chartT) => {
        const chartTotals = {}
        let utmost = 0

        chartT.data.datasets.forEach((dataset, datasetIndex) => {
          if (chartT.isDatasetVisible(datasetIndex)) {
            utmost = datasetIndex
            dataset.data.forEach((value, index) => {
              totals[index] = (totals[index] || 0) + value
            })
          }
        })

        chartT.$totalizer = {
          totals: totals,
          utmost: utmost
        }
      }
    }

    const chart: ChartData = {
      type: 'bar',
      datasets: barChartData,
      colors: barChartColors,
      labels: uniqueDates,
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        hover: {
          animationDuration: 0
        },
        animation: {
          duration: 1,
          onComplete: function (chartObj) {
            const chartInstance = chartObj.chart
            const ctx = chartInstance.ctx
            ctx.textAlign = 'center'
            ctx.textBaseline = 'bottom'

            const sumArr = new Array(barChartData[0].data.length).fill(0)

            barChartData.forEach((dataset, i) => {
              const meta = chartInstance.controller.getDatasetMeta(i)

              meta.data.forEach((bar, index) => {
                const datax = dataset.data[index]
                sumArr[index] = sumArr[index] + datax
                if (dataset.visible) {
                  ctx.fillText(sumArr[index], bar._model.x, bar._model.y - 5)
                  sumArr[index] = 0
                }
              })
            })
          }
        },
        tooltips: {
          mode: 'x',
          position: 'nearest',
          displayColors: false,
          yAlign: 'top',
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index
              return moment(d.labels[i]).format(tooltipFormat)
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.datasetIndex
              const label = d.datasets[i].label
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
