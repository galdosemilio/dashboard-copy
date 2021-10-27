import { find, isEmpty, keys, map, values, zipObject } from 'lodash'
import * as moment from 'moment-timezone'
import { from, Observable, of } from 'rxjs'

import { ConfigService, NotifierService } from '@app/service'
import { ChartData, ChartDataSource } from '@app/shared/model'
import { TranslationsObject, ViewUtils } from '@app/shared/utils'
import { PatientCountRequest, PatientCountSegment } from '@coachcare/sdk'
import { ReportsDatabase } from './reports.database'

export class EnrollmentReportsDataSource extends ChartDataSource<
  PatientCountSegment,
  PatientCountRequest
> {
  translations: TranslationsObject

  constructor(
    protected notify: NotifierService,
    protected database: ReportsDatabase,
    private config: ConfigService,
    private viewUtils: ViewUtils
  ) {
    super()
  }

  defaultFetch(): Array<PatientCountSegment> {
    return []
  }

  fetch(criteria): Observable<Array<PatientCountSegment>> {
    return criteria.organization
      ? from(this.database.fetchPatientCount(criteria))
      : of(this.defaultFetch())
  }

  mapResult(result: Array<PatientCountSegment>) {
    return result
  }

  mapChart(result: Array<PatientCountSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    const headings = []
    const chart: ChartData = {
      type: 'bar',
      colors: [],
      datasets: [],
      labels: [],
      legend: false,
      options: {
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        },
        tooltips: {
          mode: 'index',
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].datasetIndex
              const j = tooltipItem[0].index
              return headings[i][j] ? headings[i][j].date : ''
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.datasetIndex
              const j = tooltipItem.index
              const value = this.viewUtils.formatNumber(tooltipItem.yLabel)
              return headings[i][j].title
                ? `${headings[i][j].title}: ${value}`
                : null
            }
          }
        }
      }
    }

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

    // sort data based on date
    // result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    const dateArray = []

    currentDate.startOf(this.criteria.unit)
    while (currentDate <= endDate) {
      dateArray.push(currentDate.format('YYYY-MM-DD'))
      currentDate.add(1, this.criteria.unit)
    }

    // data points and headings
    let max
    const data = []
    const packages = {}
    result.forEach((segment) => {
      const date = segment.date
      let total = 0
      segment.aggregates.forEach((aggregate) => {
        const org = aggregate.organization.name
        aggregate.data.forEach((enrollment) => {
          const pack = enrollment.package.id
          let count = Number(enrollment.registrations.total)
          count = isNaN(count) ? 0 : count
          total += count

          data.push({
            x: moment(date).startOf(this.args.unit).format('YYYY-MM-DD'),
            y: this.viewUtils.formatNumber(count),
            title: pack,
            id: enrollment.package.id,
            org: org
          })
          if (!packages[pack]) {
            packages[pack] = enrollment.package.title.trim()
          }
        })
      })
      // store the min and max
      max = !max || total > max ? Math.ceil(total) : max
    })

    if (max) {
      chart.options['scales']['yAxes'][0]['ticks'] = {
        beginAtZero: true,
        min: 0,
        max: max * 1.1,
        callback: function (value: number, index: number, vals: number[]) {
          // do not display the first value and last value
          // only display when it's a whole number
          return !index || index === vals.length - 1
            ? ''
            : Math.floor(value) === value
            ? value
            : ''
        }
      }
    }

    const obj = zipObject(
      keys(packages),
      map(values(packages), () => [])
    )

    data.map((s) => obj[s.title].push(s))

    keys(obj).map((e, i) => {
      const arr = obj[e]
      dateArray.map((date) => {
        if (!find(arr, (o) => o.x === date)) {
          arr.push({ x: date, y: 0, title: '' })
        }

        arr.sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0))
      })
    })

    if (!isEmpty(obj)) {
      chart.datasets.length = 0
      keys(obj).map((pack, i) => {
        chart.datasets.push({
          label: packages[pack],
          data: obj[pack]
        })
        chart.colors.push({
          backgroundColor: this.config.get('colors').get(i),
          hoverBackgroundColor: this.config.get('colors').get(i, 'contrast')
        })
        headings.push(
          obj[pack].map((s) => ({
            date: moment(s.x).format(tooltipFormat),
            title: packages[s.title],
            count: s.y
          }))
        )
      })
    }

    // labels
    chart.labels = dateArray.map((s) => moment(s).format(xlabelFormat))

    return chart
  }
}
