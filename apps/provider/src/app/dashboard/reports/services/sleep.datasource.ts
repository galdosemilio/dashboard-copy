import { MatPaginator, MatSort } from '@coachcare/material'
import * as moment from 'moment-timezone'

import { from, Observable, of } from 'rxjs'
import { StatisticsDatabase } from './statistics.database'

import {
  SleepChangeOrder,
  SortDirection
} from '@app/dashboard/reports/services'
import { NotifierService } from '@app/service'
import { ChartData, ChartDataSource } from '@app/shared/model'
import {
  SleepReportRequest,
  SleepReportResponse,
  SleepReportSegment
} from '@coachcare/sdk'

export class SleepDataSource extends ChartDataSource<
  SleepReportSegment,
  SleepReportRequest
> {
  constructor(
    protected notify: NotifierService,
    protected database: StatisticsDatabase,
    private paginator?: MatPaginator,
    private sort?: MatSort
  ) {
    super()

    // listen the paginator events
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
              ? (this.sort.active as SleepChangeOrder)
              : 'name',
            dir: (this.sort.direction as SortDirection) || 'asc'
          }
        ]
      }))
    }
  }

  defaultFetch(): SleepReportResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: SleepReportRequest): Observable<SleepReportResponse> {
    return criteria.organization
      ? from(this.database.fetchSleep(criteria))
      : of(this.defaultFetch())
  }

  mapResult(result: SleepReportResponse): Array<SleepReportSegment> {
    if (!result || !result.data.length) {
      return []
    }

    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    return result.data
  }

  mapChart(result: Array<SleepReportSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    const dates = result
      .map((v) => v.date)
      .filter((v, i, self) => self.indexOf(v) === i)

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

    const avgs = dates.map((date) => {
      const users = result.filter(
        (record) => record.date === date && record.hoursSlept.avg > 0
      )
      return (
        users.reduce((sum, record) => sum + record.hoursSlept.avg, 0) /
        users.length
      ).toFixed(1)
    })

    const chart: ChartData = {
      type: 'bar',
      datasets: [
        {
          data: avgs
        }
      ],
      labels: dates,
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
              return 'Hours: ' + tooltipItem.yLabel
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
