import { TranslateService } from '@ngx-translate/core';
import { find, isEmpty, map, zipObject } from 'lodash';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable, of } from 'rxjs';

import { ConfigService, NotifierService } from '@app/service';
import {
  _,
  ChartData,
  ChartDataSource,
  TranslationsObject,
  ViewUtils
} from '@app/shared';
import { SignupsTimelineRequest, SignupsTimelineSegment } from '@app/shared/selvera-api';
import { ReportsDatabase } from './reports.database';

export class SignupsReportsDataSource extends ChartDataSource<
  SignupsTimelineSegment,
  SignupsTimelineRequest
> {
  translations: TranslationsObject;

  constructor(
    protected notify: NotifierService,
    protected database: ReportsDatabase,
    private translator: TranslateService,
    private config: ConfigService,
    private viewUtils: ViewUtils
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
      .get([_('GRAPH.SIGNUPS')])
      .subscribe((translations) => (this.translations = translations));
  }

  defaultFetch(): Array<SignupsTimelineSegment> {
    return [];
  }

  fetch(criteria): Observable<Array<SignupsTimelineSegment>> {
    return criteria.organization
      ? from(this.database.fetchSignupsTimelineReport(criteria))
      : of(this.defaultFetch());
  }

  mapResult(result: Array<SignupsTimelineSegment>) {
    return result;
  }

  mapChart(result: Array<SignupsTimelineSegment>): ChartData {
    if (!result || !result.length) {
      return super.defaultChart();
    }

    const headings = [];
    const chart: ChartData = {
      type: 'bar',
      colors: [],
      datasets: [{ data: [] }],
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
          displayColors: false,
          callbacks: {
            title: (tooltipItem, d) => {
              const i = tooltipItem[0].datasetIndex;
              const j = tooltipItem[0].index;
              return headings[i][j] ? headings[i][j].date : '';
            },
            label: (tooltipItem, d) => {
              const i = tooltipItem.datasetIndex;
              const j = tooltipItem.index;
              const value = this.viewUtils.formatNumber(tooltipItem.yLabel);
              return headings[i][j] && value !== '0'
                ? `${headings[i][j].title}: ${value}`
                : '';
            }
          }
        }
      }
    };

    // formats
    const endDate = moment(this.criteria.endDate);
    const currentDate = moment(this.criteria.startDate);
    const diff = endDate.diff(this.criteria.startDate, 'days');

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

    // sort data based on date
    result.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0));

    const dateArray = [];

    currentDate.startOf(this.criteria.unit);
    while (currentDate <= endDate) {
      dateArray.push(currentDate.format('YYYY-MM-DD'));
      currentDate.add(1, this.criteria.unit);
    }

    // data points and headings
    let max;
    const data = [];
    const orgs = [];
    result.forEach((segment) => {
      const date = segment.date;
      let total = 0;
      segment.aggregates.forEach((aggregate) => {
        const org = aggregate.organization;
        const count = Number(aggregate.signUps);
        total += count;

        data.push({
          x: moment(date).startOf(this.args.unit).format('YYYY-MM-DD'),
          y: count,
          title: org.name.trim(),
          id: org.id
        });
        orgs.indexOf(org.name) === -1 ? orgs.push(org.name.trim()) : () => {}; // no-op of typescript
      });
      // store the min and max
      max = !max || total > max ? Math.ceil(total) : max;
    });

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

    orgs.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const obj = zipObject(
      orgs,
      map(orgs, () => [])
    );
    data.map((s) => obj[s.title].push(s));

    Object.keys(obj).map((e, i) => {
      const arr = obj[e];
      dateArray.map((date) => {
        !find(arr, (o) => o.x === date) && arr.push({ x: date, y: 0, title: '' });
        arr.sort((a, b) => (a.x > b.x ? 1 : b.x > a.x ? -1 : 0));
      });
    });

    if (!isEmpty(obj)) {
      chart.datasets.length = 0;
      Object.keys(obj).map((org, i) => {
        chart.datasets.push({
          label: org,
          data: obj[org]
        });
        chart.colors.push({
          backgroundColor: this.config.get('colors').get(i),
          hoverBackgroundColor: this.config.get('colors').get(i, 'contrast')
        });
        headings.push(
          obj[org].map((s) => {
            return {
              date: moment(s.x).format(tooltipFormat),
              title: s.title,
              count: s.y
            };
          })
        );
      });
    }

    // labels
    chart.labels = dateArray.map((s) => moment(s).format(xlabelFormat));

    return chart;
  }
}
