import { TableDataSource } from '@app/shared';
import { _ } from '@app/shared/utils';
import { groupBy } from 'lodash';
import * as moment from 'moment';
import { from, Observable } from 'rxjs';
import {
  GetAllExerciseRequest,
  GetAllExerciseResponse
} from 'selvera-api/dist/lib/selvera-api/providers/exercise';
import { FetchAllConsumedKeyRequest } from 'selvera-api/dist/lib/selvera-api/providers/foodKey/requests';
import { FetchAllConsumedKeyResponse } from 'selvera-api/dist/lib/selvera-api/providers/foodKey/responses';
import { MetricsDatabase } from './metrics.database';

export interface MetricsDataSourceCriteria
  extends FetchAllConsumedKeyRequest,
    GetAllExerciseRequest {
  limit?: number | 'all';
}

export interface MetricsDataSourceResponse {
  exercise: GetAllExerciseResponse;
  keys: FetchAllConsumedKeyResponse;
}

export interface MetricsRow {
  date: string;
  aerobic: number;
  strength: number;
  foodKey: number;
  unit: string;
}

export class MetricsDataSource extends TableDataSource<
  any,
  MetricsDataSourceResponse,
  MetricsDataSourceCriteria
> {
  private exerciseTypes = {
    aerobic: {
      displayName: _('GLOBAL.AEROBIC'),
      name: 'Aerobic',
      unit: _('GLOBAL.MINUTES')
    },
    strength: {
      displayName: _('GLOBAL.STRENGTH'),
      name: 'Strength',
      unit: _('GLOBAL.MINUTES')
    }
  };

  constructor(protected database: MetricsDatabase) {
    super();
  }

  public defaultFetch(): MetricsDataSourceResponse {
    return { keys: { data: [], pagination: {} }, exercise: { data: [], pagination: {} } };
  }

  public fetch(criteria: any): Observable<MetricsDataSourceResponse> {
    return from(this.database.fetch(criteria));
  }

  public mapResult(result: MetricsDataSourceResponse): MetricsRow[] {
    const emptyDays = this.calculateEmptyDays();

    const groupedExerciseEntries = groupBy(result.exercise.data, (exEntry) =>
      moment(exEntry.activitySpan.start).format('YYYY-MM-DD')
    );

    const groupedFoodKeyEntries = groupBy(result.keys.data, (fkEntry) =>
      moment(fkEntry.consumedAt).format('YYYY-MM-DD')
    );

    const metricsRows: MetricsRow[] = emptyDays.map((emptyDay) => {
      const formattedDate = moment(emptyDay.date).format('YYYY-MM-DD');
      const exerciseEntryGroup = groupedExerciseEntries[formattedDate] || [];

      const foodKeyEntryGroup = groupedFoodKeyEntries[formattedDate] || [];

      return {
        date: emptyDay.date,
        value: 0,
        name: '',
        unit: '',
        aerobic: this.calculateExerciseAmount(
          exerciseEntryGroup,
          this.exerciseTypes.aerobic.name
        ),
        strength: this.calculateExerciseAmount(
          exerciseEntryGroup,
          this.exerciseTypes.strength.name
        ),
        foodKey: foodKeyEntryGroup.reduce((sum, fkEntry) => sum + fkEntry.quantity, 0)
      };
    });

    return metricsRows;
  }

  private calculateEmptyDays(): MetricsRow[] {
    let endDate = moment(this.args.endDate);
    const emptyDays = [];
    const emptyMeasurement: MetricsRow = {
      date: '',
      aerobic: 0,
      strength: 0,
      foodKey: 0,
      unit: ''
    };

    if (endDate.isAfter(moment(), 'day')) {
      endDate = endDate.add(1, 'day');
    }

    for (
      let currentDate = moment(this.args.startDate).startOf('day');
      currentDate <= endDate;
      currentDate = currentDate.add(1, 'day')
    ) {
      const currentFormattedDate = currentDate.toISOString();
      const emptyMeasurementItem = { ...emptyMeasurement };
      emptyMeasurementItem.date = currentFormattedDate;
      emptyDays.push(emptyMeasurementItem);
    }

    return emptyDays;
  }

  private calculateExerciseAmount(exerciseEntries, exerciseName: string): number {
    const targetExercises = exerciseEntries.filter(
      (exerciseEntry) => exerciseEntry.exerciseType.name === exerciseName
    );

    return targetExercises.reduce((sum, entry) => {
      const startDate = moment(entry.activitySpan.start);
      return sum + Math.abs(startDate.diff(moment(entry.activitySpan.end), 'minutes'));
    }, 0);
  }
}
