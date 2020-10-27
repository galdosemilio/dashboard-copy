import { TranslateService } from '@ngx-translate/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable, of } from 'rxjs';

import { NotifierService } from '@app/service';
import { _, ChartData, ChartDataSource, TranslationsObject } from '@app/shared';
import { ActivityLevelRequest, ActivityLevelSegment } from '@app/shared/selvera-api';
import { StatisticsDatabase } from './statistics.database';

export class StepsDataSource extends ChartDataSource<
  ActivityLevelSegment,
  ActivityLevelRequest
> {
  translations: TranslationsObject;

  constructor(
    protected notify: NotifierService,
    protected database: StatisticsDatabase,
    private translator: TranslateService
  ) {
    super();

    // translatable labels
    this.buildTranslations();
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => {
        this.buildTranslations();
      });
  }

  disconnect() {}

  private buildTranslations() {
    this.translator
      .get([_('REPORTS.PATIENTS'), _('REPORTS.LEVEL')])
      .subscribe((translations) => (this.translations = translations));
  }

  defaultFetch(): Array<ActivityLevelSegment> {
    return [];
  }

  fetch(criteria: ActivityLevelRequest): Observable<Array<ActivityLevelSegment>> {
    return criteria.organization
      ? from(this.database.fetchActivityLevel(criteria))
      : of(this.defaultFetch());
  }

  mapResult(result: Array<ActivityLevelSegment>): Array<ActivityLevelSegment> {
    if (!result || !result.length) {
      return [];
    }
    return result;
  }

  mapChart(result: Array<ActivityLevelSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart();
    }

    const levels = this.criteria.level.map((v) => v.name);

    let max;
    const data = levels.map((level) => {
      let count = 0;
      result.forEach((v) => {
        if (v.level.name === level) {
          count++;
        }
      });
      max = !max || count > max ? count : max;
      return count;
    });

    const chart: ChartData = {
      type: 'bar',
      datasets: [
        {
          data: data
        }
      ],
      labels: levels,
      options: {
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index;
              return this.translations['REPORTS.LEVEL'] + ': ' + d.labels[i];
            },
            label: (tooltipItem, d) => {
              return this.translations['REPORTS.PATIENTS'] + ': ' + tooltipItem.yLabel;
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
                  return Math.floor(value) === value ? value : '';
                }
              }
            }
          ]
        }
      }
    };

    if (max) {
      chart.options['scales']['yAxes'][0]['ticks'] = {
        beginAtZero: true,
        min: 0,
        max: max * 1.1,
        callback: function (value: number, index: number, values: number[]) {
          // do not display the first value and last value
          // only display when it's a whole number
          return !index || index === values.length - 1
            ? ''
            : Math.floor(value) === value
            ? value
            : '';
        }
      };
    }

    return chart;
  }
}
