import { TranslateService } from '@ngx-translate/core';
import { clone, find } from 'lodash';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable, of } from 'rxjs';

import { NotifierService } from '@app/service';
import { _, ChartData, ChartDataSource, TranslationsObject } from '@app/shared';
import {
  AgeDemographicsRequest,
  AgeDemographicsSegment,
  BucketSegment
} from '@app/shared/selvera-api';
import { StatisticsDatabase } from './statistics.database';

export class AgeDataSource extends ChartDataSource<
  BucketSegment,
  AgeDemographicsRequest
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
      .get([_('REPORTS.TOTAL'), _('REPORTS.UNKNOWN')])
      .subscribe((translations) => (this.translations = translations));
  }

  defaultFetch(): Array<AgeDemographicsSegment> {
    return [];
  }

  fetch(criteria: AgeDemographicsRequest): Observable<Array<AgeDemographicsSegment>> {
    return criteria.organization
      ? from(this.database.fetchAgeDemographics(criteria))
      : of([]);
  }

  mapResult(result: Array<AgeDemographicsSegment>): Array<BucketSegment> {
    if (!result.length) {
      return [];
    }

    const data = result[0].buckets;
    const def = (name): BucketSegment => ({
      bucket: { name },
      count: 0,
      percentage: 0
    });

    const threesholds = clone(this.criteria.age);
    if (find(data, (o) => o.bucket.name === undefined)) {
      // unknown category
      threesholds.push({ name: undefined, threshold: null });
    }

    // return the results in the requested order
    return threesholds.map((age) => {
      const res = find(data, (o) => o.bucket.name === age.name);
      if (res) {
        res.percentage = Number(res.percentage.toFixed(1));
      }
      return res || def(age.name);
    });
  }

  mapChart(result: Array<BucketSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart();
    }

    const data = [];
    const labels = [];
    const count = [];

    result
      .filter((v) => v.percentage)
      .map((v) => {
        data.push(v.percentage.toFixed(1));
        count.push(v.count);
        labels.push(() =>
          v.bucket.name ? v.bucket.name : this.translations['REPORTS.UNKNOWN']
        );
      });

    const headings = [];
    const chart: ChartData = {
      type: 'pie',
      datasets: [
        {
          data: data,
          count: count
        }
      ],
      labels,
      options: {
        tooltips: {
          mode: 'label',
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].index;
              return d.labels[i]();
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.index;
              return this.translations['REPORTS.TOTAL'] + ': ' + d.datasets[0].count[i];
            },
            afterLabel: (tooltipItem, d) => {
              const i = tooltipItem.index;
              return d.datasets[0].data[i] + '%';
            }
          }
        }
      }
    };

    return chart;
  }
}
