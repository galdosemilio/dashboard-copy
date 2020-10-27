import { isArray, isFunction } from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { _, UnitFormatters } from '@app/shared/utils';
import { map } from 'rxjs/operators';
import { TableDataSource } from './table.datasource';

export interface ChartData {
  type?: string;
  data?: Array<any>;
  datasets?: Array<any>;
  labels?: Array<any>;
  options?: object;
  colors?: Array<any>;
  legend?: boolean;
}

export abstract class ChartDataSource<T, C> extends TableDataSource<T, any, C> {
  /**
   * Latest retrieved data.
   */
  get cdata(): ChartData {
    if (!this.isLoading && this._data) {
      const res = this.mapResult(this._data);
      // TODO handle promise result
      if (isArray(res)) {
        return this.mapChart(res);
      }
    }
    return this.defaultChart();
  }

  /**
   * Observable of data summary of the resulting query.
   */
  summary$ = new BehaviorSubject<any>({});

  /**
   * Config defaults manipulable from outside.
   */
  settings: ChartData = {
    type: 'line',
    legend: true,
    colors: undefined
  };

  /**
   * Labels unit processors.
   */
  formatters: UnitFormatters = {};

  /**
   * Connects a charting component to this data source. Note that
   * the stream provided will be accessed during change detection and should not directly change
   * values that are bound in template views.
   * @returns Observable that emits a new value when the data changes.
   */
  chart(): Observable<ChartData> {
    // TODO inject config and merge this.config.get('chart').factory(type)
    return this.connect().pipe(
      map(this.mapChart.bind(this)),
      map((chart: ChartData) => {
        if (chart.datasets.length === 1) {
          if (chart.datasets[0].data) {
            this.isEmpty = !chart.datasets[0].data.length;
            if (!this.hasErrors() && this.isEmpty && this.showEmpty) {
              const error =
                typeof this.showEmpty === 'boolean'
                  ? _('NOTIFY.SOURCE.NO_DATA_AVAILABLE')
                  : isFunction(this.showEmpty)
                  ? this.showEmpty()
                  : this.showEmpty;
              this.addError(error);
            }
            this.isLoading = false;
            this.change$.next();
          }
        }
        return chart;
      })
    );
  }

  defaultChart(): ChartData {
    return Object.assign(
      {
        datasets: [{ data: [] }],
        labels: []
      },
      this.settings
    );
  }

  abstract mapChart(result: Array<T>): ChartData;
}
