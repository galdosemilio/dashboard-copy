import { CcrPaginatorComponent } from '@coachcare/common/components'
import { TableDataSource } from '@app/shared/model'
import { FetchSharpReportRequest } from '@coachcare/sdk'
import { from, Observable } from 'rxjs'
import { StatisticsDatabase } from './statistics.database'
import {
  DataAggregate,
  FetchSharpReportResponse,
  SharpReportItem
} from '@coachcare/sdk/dist/lib/providers/reports/responses/fetchSharpReportResponse.interface'

export type SharpReportItemSummary = SharpReportItem & {
  kcalTotalSum: number
  exerciseMinutesTotalSum: number
  mealReplacementTotalSum: number
  vegetablesFruitsTotalSum: number
}

export const MEAL_REPLACEMENT_ID = '69'
export const VEGETABLES_FRUITS_ID = '70'

export class SharpReportDataSource extends TableDataSource<
  SharpReportItem,
  FetchSharpReportResponse,
  FetchSharpReportRequest
> {
  constructor(
    protected database: StatisticsDatabase,
    private paginator?: CcrPaginatorComponent
  ) {
    super()

    this.pageSize = 25
    // listen the paginator events
    if (this.paginator) {
      this.addOptional(this.paginator.page, () => ({
        limit: this.paginator.pageSize,
        offset: this.paginator.pageIndex * this.paginator.pageSize
      }))
    }
  }

  defaultFetch(): FetchSharpReportResponse {
    return { data: [], pagination: {} }
  }

  fetch(
    criteria: FetchSharpReportRequest
  ): Observable<FetchSharpReportResponse> {
    return from(this.database.fetchSharpReport(criteria))
  }

  getAggregatesValue(entry?: DataAggregate) {
    if (!entry) {
      return 0
    }

    if (typeof entry.key === 'string') {
      return entry.value
    }

    if (entry.key?.type?.multiplier) {
      return parseFloat((entry.value / entry.key.type.multiplier).toFixed(1))
    }

    return entry.value
  }

  mapResult(result: FetchSharpReportResponse): Array<SharpReportItemSummary> {
    // pagination handling
    this.getTotal(result)

    return result.data.map((item) => {
      return {
        ...item,
        kcalTotalSum: this.getAggregatesValue(
          item.aggregates.find((aggregate) => aggregate.key == 'kcal')
        ),
        exerciseMinutesTotalSum: this.getAggregatesValue(
          item.aggregates.find(
            (aggregate) => aggregate.key == 'exercise-minutes'
          )
        ),
        mealReplacementTotalSum: this.getAggregatesValue(
          item.aggregates.find(
            (aggregate) =>
              typeof aggregate.key == 'object' &&
              aggregate.key.type.id == MEAL_REPLACEMENT_ID
          )
        ),
        vegetablesFruitsTotalSum: this.getAggregatesValue(
          item.aggregates.find(
            (aggregate) =>
              typeof aggregate.key == 'object' &&
              aggregate.key.type.id == VEGETABLES_FRUITS_ID
          )
        )
      }
    })
  }
}
