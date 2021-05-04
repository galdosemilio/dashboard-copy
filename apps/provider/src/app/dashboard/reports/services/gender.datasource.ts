import { TranslateService } from '@ngx-translate/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { from, Observable, of } from 'rxjs'
import { StatisticsDatabase } from './statistics.database'

import { NotifierService } from '@app/service'
import { _, ChartData, ChartDataSource, TranslationsObject } from '@app/shared'
import {
  GenderDemographicsRequest,
  GenderDemographicsSegment
} from '@coachcare/sdk'

@UntilDestroy()
export class GenderDataSource extends ChartDataSource<
  GenderDemographicsSegment,
  GenderDemographicsRequest
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
      .get([
        _('REPORTS.TOTAL'),
        _('REPORTS.MALE'),
        _('REPORTS.FEMALE'),
        _('REPORTS.UNSPECIFIED')
      ])
      .subscribe((translations) => (this.translations = translations))
  }

  defaultFetch(): Array<GenderDemographicsSegment> {
    return []
  }

  fetch(
    criteria: GenderDemographicsRequest
  ): Observable<Array<GenderDemographicsSegment>> {
    return criteria.organization
      ? from(this.database.fetchGenderDemographics(criteria))
      : of(this.defaultFetch())
  }

  mapResult(result: Array<GenderDemographicsSegment>) {
    if (!result.length) {
      return this.defaultFetch()
    }

    const x = []

    x.push({
      name: 'REPORTS.MALE',
      count: result[0].male.count,
      percentage: result[0].male.percentage.toFixed(1)
    })
    x.push({
      name: 'REPORTS.FEMALE',
      count: result[0].female.count,
      percentage: result[0].female.percentage.toFixed(1)
    })

    return x
  }

  mapChart(result): ChartData {
    if (!result || !result.length) {
      return super.defaultChart()
    }

    const data = result.map((v) => v.count)
    const percentage = result.map((v) => v.percentage)
    const labels = result.map((v) => () => this.translations[v.name])

    const headings = []
    const chart: ChartData = {
      type: 'pie',
      datasets: [
        {
          data: data,
          percentage: percentage
        }
      ],
      labels: labels,
      options: {
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index
              return d.labels[i]()
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.index
              return (
                this.translations['REPORTS.TOTAL'] +
                ': ' +
                d.datasets[0].data[i]
              )
            },
            afterLabel: (tooltipItem, d) => {
              const i = tooltipItem.index
              return d.datasets[0].percentage[i] + '%'
            }
          }
        }
      }
    }

    return chart
  }
}
