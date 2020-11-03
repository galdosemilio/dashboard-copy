import { UnitFormatters } from '@coachcare/backend/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableDataSource } from './table.datasource';

export interface ChartData {
  type?: string;
  data?: number[] | any[];
  datasets?: any[];
  labels?: Array<any>;
  options?: object;
  colors?: Array<any>;
  legend?: boolean;
}

export abstract class ChartDataSource<T, C> extends TableDataSource<T, any, C> {
  /**
   * Observable of data summary of the resulting query.
   */
  summary$ = new BehaviorSubject<any>({});

  /**
   * Config defaults manipulable from outside.
   */
  config = {
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
    return this.connect().pipe(map(this.mapChart.bind(this)));
  }

  defaultData(): ChartData {
    return {
      datasets: [{ data: [] }],
      labels: [],
      ...this.config
    };
  }

  abstract mapChart(result: T[]): ChartData;
}
