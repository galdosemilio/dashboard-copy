import { Injectable } from '@angular/core';
import { NotifierService } from '@app/service';
import { ChartData, ChartDataSource } from '@app/shared';
import {
  BodySummaryDataResponseSegment,
  FetchBodySummaryRequest,
  FetchBodySummaryResponse
} from '@app/shared/selvera-api';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable } from 'rxjs';
import { LevlDatabase } from './levl.database';

import { _, DataObject } from '@app/shared';

@Injectable()
export class LevlDataSource extends ChartDataSource<
  BodySummaryDataResponseSegment,
  FetchBodySummaryRequest
> {
  i18n: DataObject;

  constructor(
    protected notify: NotifierService,
    protected database: LevlDatabase,
    private translator: TranslateService
  ) {
    super();

    // factors with translatable units
    this.translate();
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.translate();
      });
  }

  disconnect() {}

  private translate() {
    this.translator
      .get([_('UNIT.ACETONE')])
      .subscribe((translations) => (this.i18n = translations));
  }

  defaultFetch(): FetchBodySummaryResponse {
    return {
      data: [],
      summary: {}
    };
  }

  fetch(criteria: FetchBodySummaryRequest): Observable<FetchBodySummaryResponse> {
    return from(this.database.fetchAcetonePpm(criteria));
  }

  mapResult(result: FetchBodySummaryResponse): Array<BodySummaryDataResponseSegment> {
    return result.data;
  }

  mapChart(result: Array<BodySummaryDataResponseSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart();
    }

    // filter empty values
    const field = this.criteria.data[0];
    result = result.filter((s) => s[field]);

    const dates = result.map((v) => v.date);
    const data = result.map((v) => v[field] / 100);
    // formats
    const endDate = moment(this.criteria.endDate);
    const currentDate = moment(this.criteria.startDate);

    let xlabelFormat;
    let tooltipFormat;
    switch (this.args.unit) {
      case 'day':
        xlabelFormat = endDate.month() !== currentDate.month() ? 'MMM D' : 'ddd D';
        tooltipFormat = 'ddd, MMM D';
        break;
      case 'week':
        xlabelFormat = 'MMM D';
        tooltipFormat = 'MMM D, YYYY';
        break;
      case 'month':
        xlabelFormat = 'MMM YYYY';
        tooltipFormat = 'MMM YYYY';
        break;
    }

    const chart: ChartData = {
      type: 'line',
      datasets: [
        {
          data: data.length ? [null, ...data, null] : []
        },
        {
          data: data.length ? [2, ...data.map(() => 2), 2] : [],
          fill: false,
          radius: 0,
          pointHoverRadius: 0,
          borderColor: 'rgba(0,0,0,0.1)'
        }
      ],
      labels: dates.length ? ['', ...dates, ''] : dates,
      options: {
        animation: {
          duration: 0
        },
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index;
              return moment(d.labels[i]).format(tooltipFormat);
            },
            label: (tooltipItem, d) => {
              return tooltipItem.datasetIndex === 0
                ? this.i18n['UNIT.ACETONE'] + ': ' + tooltipItem.yLabel
                : '';
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                callback: function (value, index, values) {
                  return value ? moment(value).format(xlabelFormat) : '';
                }
              }
            }
          ]
        }
      }
    };

    return chart;
  }
}
