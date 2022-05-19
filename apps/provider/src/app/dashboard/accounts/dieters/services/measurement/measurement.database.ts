import { Injectable } from '@angular/core'
import { Food } from '@coachcare/sdk'
import { MeasurementCriteria } from '@app/service'
import { CcrDatabase, FoodSummaryValues } from '@app/shared'
import {
  FetchSummaryRequest as FetchFoodSummaryRequest,
  SummaryDataResponse as FoodSummaryDataResponseSegment
} from '@coachcare/sdk'

@Injectable()
export class MeasurementDatabase extends CcrDatabase {
  constructor(private food: Food) {
    super()
  }

  fetchFoodSummary(args): Promise<FoodSummaryDataResponseSegment[]> {
    const request: FetchFoodSummaryRequest = {
      client: args.account,
      data: args.data,
      unit: args.unit,
      startDate: args.startDate,
      endDate: args.endDate ? args.endDate : undefined
    }

    return this.food.fetchSummary(request)
  }

  fetchAllSummary(args: MeasurementCriteria): Promise<any> {
    // discriminate the required data by api
    const apis = {
      fetchFoodSummary: [] // result[0] check on datasource
    }
    args.data.forEach((data) => {
      if (FoodSummaryValues.includes(data)) {
        apis.fetchFoodSummary.push(data)
      }
    })

    // fetch each data from the corresponding API
    const promises = []
    Object.keys(apis).forEach((api) => {
      if (apis[api].length) {
        const request: MeasurementCriteria = Object.assign({}, args, {
          data: apis[api]
        })
        promises.push(this[api](request))
      }
    })
    return Promise.all(promises)
  }

  resolveResult(measurement) {
    // TODO expand to multiple fields when available
    // display a different field than the specified one
    switch (measurement) {
      case 'average':
        return 'averageMinutes'
      case 'distance':
        return 'distanceTotal'
      case 'steps':
        return 'stepTotal'
      case 'total':
        return 'sleepMinutes'
      default:
        return measurement
    }
  }
}
