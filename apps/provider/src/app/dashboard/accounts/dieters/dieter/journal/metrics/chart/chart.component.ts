import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {
  MeasurementTimeframe,
  MetricsChartDataSource
} from '@app/dashboard/accounts/dieters/services';
import { ConfigService } from '@app/service';
import { DateNavigatorOutput, SelectOptions, sleep } from '@app/shared';
import { _ } from '@app/shared/utils';
import { merge } from 'lodash';
import * as moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dieter-journal-metrics-chart',
  templateUrl: './chart.component.html',
  host: { class: 'ccr-chart' }
})
export class MetricsChartComponent implements OnDestroy, OnInit {
  @Input() initialDates: DateNavigatorOutput;
  @Input()
  source: MetricsChartDataSource;

  @Input()
  timeframe: MeasurementTimeframe = 'week';

  @Output()
  dateChange: EventEmitter<DateNavigatorOutput> = new EventEmitter<DateNavigatorOutput>();

  public chart: any;
  // dates navigator store
  public dates: DateNavigatorOutput = {};
  public metrics: SelectOptions<string> = [
    {
      value: 'foodKey',
      viewValue: _('GLOBAL.RED_FOODS')
    },
    {
      value: 'aerobic',
      viewValue: _('GLOBAL.AEROBIC')
    },
    {
      value: 'strength',
      viewValue: _('GLOBAL.STRENGTH')
    }
  ];
  public viewby: SelectOptions<MeasurementTimeframe> = [
    { value: 'week', viewValue: _('SELECTOR.VIEWBY.WEEK') },
    { value: 'month', viewValue: _('SELECTOR.VIEWBY.MONTH') },
    { value: 'year', viewValue: _('SELECTOR.VIEWBY.YEAR') },
    { value: 'alltime', viewValue: _('SELECTOR.VIEWBY.ALL_TIME') }
  ];

  private refresh$ = new Subject<any>();

  constructor(private cdr: ChangeDetectorRef, private config: ConfigService) {}

  public ngOnDestroy(): void {
    this.source.unregister('chart');
  }

  public ngOnInit(): void {
    if (this.initialDates) {
      this.dates = this.initialDates;
    }

    this.source.metric = this.metrics[0].value;
    this.subscribeToSource();
  }

  public refresh(): void {
    this.refresh$.next();
  }

  public async updateDates(dates: DateNavigatorOutput): Promise<void> {
    await sleep(100);
    this.dates = dates;
    this.dateChange.emit(this.dates);
    this.refresh$.next(true);
  }

  private subscribeToSource(): void {
    this.source.register('chart', false, this.refresh$, () => ({
      timeframe: this.dates.timeframe as MeasurementTimeframe,
      startDate: moment(this.dates.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.dates.endDate).format('YYYY-MM-DD')
    }));

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe(async (chart) => {
        this.chart = undefined; // force refresh on change
        this.cdr.detectChanges();
        this.chart = {};
        merge(this.chart, this.config.get('chart').factory('line'), chart);
        this.source.change$.next();
        this.cdr.detectChanges();
      });
  }
}
