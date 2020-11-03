import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { isEmpty, merge } from 'lodash';
import * as moment from 'moment-timezone';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';

import {
  ReportsCriteria,
  StatisticsDatabase,
  WeightChangeDataSource
} from '@app/dashboard/reports/services';
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store';
import { ConfigService, NotifierService } from '@app/service';
import { ChartData } from '@app/shared';

@Component({
  selector: 'app-statistics-weight-change-chart',
  templateUrl: './weight-change.component.html',
  styleUrls: ['./weight-change.component.scss'],
  host: { class: 'ccr-chart' }
})
export class WeightChangeChartComponent implements OnInit, AfterViewInit, OnDestroy {
  source: WeightChangeDataSource | null;
  chart: ChartData;
  chartWidth: any;

  // subscription for selector changes
  data: ReportsCriteria;

  // refresh trigger
  refresh$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private config: ConfigService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new WeightChangeDataSource(
      this.notifier,
      this.database,
      this.translator
    );

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data ? moment(this.data.startDate).format('YYYY-MM-DD') : null,
      endDate: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null,
      limit: 'all'
    }));

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.chart = undefined; // force refresh on change
        this.chartWidth = chart.datasets[0].chartWidth;
        setTimeout(() => {
          this.chart = {};
          merge(this.chart, this.config.get('chart').factory('bar'), chart);
        }, 50);
      });

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria;
          this.refresh$.next();
        }
      });

    // TODO listen org changes to reload colors
  }

  ngAfterViewInit() {
    if (!this.source.isLoaded) {
      this.refresh$.next();
      this.cdr.detectChanges();
    }
  }

  ngOnDestroy() {
    this.source.disconnect();
  }
}
