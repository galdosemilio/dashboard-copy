import { Injectable } from '@angular/core'
import {
  Food,
  MeasurementActivity,
  MeasurementBody,
  MeasurementSleep
} from '@coachcare/sdk'

import {
  ActivitySummaryValues,
  BodySummaryValues,
  CcrDatabase,
  FoodSummaryValues,
  SleepSummaryValues
} from '@app/shared'
import {
  Entity,
  FetchActivityRequest,
  FetchActivityResponse,
  FetchActivitySummaryRequest,
  FetchActivitySummaryResponse,
  FetchBodyMeasurementRequest,
  FetchBodyMeasurementResponse,
  FetchBodySummaryResponse,
  FetchSummaryRequest as FetchFoodSummaryRequest,
  FetchSleepMeasurementRequest,
  FetchSleepMeasurementResponse,
  FetchSleepMeasurementSummaryRequest,
  FetchSleepMeasurementSummaryResponse,
  SummaryDataResponse as FoodSummaryDataResponseSegment
} from '@coachcare/sdk'
import {
  MeasurementCriteria,
  MeasurementSummaryData
} from './measurement.criteria'

@Injectable()
export class MeasurementDatabase extends CcrDatabase {
  constructor(
    private activity: MeasurementActivity,
    private body: MeasurementBody,
    private sleep: MeasurementSleep,
    private food: Food
  ) {
    super()
  }

  deleteBodyMeasurement(args: Entity): Promise<void> {
    return this.body.deleteBodyMeasurement(args.id)
  }

  fetchActivity(args: FetchActivityRequest): Promise<FetchActivityResponse[]> {
    // TODO can implement pagination storing a cache and comparing the last request
    const request: FetchActivityRequest = {
      account: args.account,
      startDate: args.startDate,
      endDate: args.endDate,
      max: args.max ? args.max : undefined,
      direction: args.direction ? args.direction : undefined
    }

    return this.activity.fetchActivity(request)
  }

  fetchActivitySummary(
    args: FetchActivitySummaryRequest
  ): Promise<FetchActivitySummaryResponse> {
    const request: FetchActivitySummaryRequest = {
      account: args.account,
      data: args.data,
      unit: args.unit,
      startDate: args.startDate,
      endDate: args.endDate ? args.endDate : undefined,
      max: args.max ? args.max : undefined
    }

    return this.activity.fetchSummary(request)
  }

  fetchBodyMeasurement(
    args: FetchBodyMeasurementRequest
  ): Promise<FetchBodyMeasurementResponse> {
    return this.body.fetchBodyMeasurement(args)
  }

  fetchBodySummary(args: any): Promise<FetchBodySummaryResponse> {
    const request: any = {
      account: args.account,
      data: args.data,
      unit: args.unit,
      startDate: args.startDate,
      endDate: args.endDate ? args.endDate : undefined,
      max: args.max ? args.max : undefined,
      aggregation: args.aggregation || 'mostRecent'
    }

    return this.body.fetchSummary(request)
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

  fetchSleep(
    args: FetchSleepMeasurementRequest
  ): Promise<FetchSleepMeasurementResponse[]> {
    // TODO can implement pagination storing a cache and comparing the last request
    const request: FetchSleepMeasurementRequest = {
      account: args.account,
      startDate: args.startDate,
      endDate: args.endDate
    }

    return this.sleep.fetchSleep(request)
  }

  fetchSleepSummary(
    args: FetchSleepMeasurementSummaryRequest
  ): Promise<FetchSleepMeasurementSummaryResponse> {
    const request: FetchSleepMeasurementSummaryRequest = {
      account: args.account,
      data: args.data,
      unit: args.unit,
      startDate: args.startDate,
      endDate: args.endDate ? args.endDate : undefined,
      max: args.max ? args.max : undefined
    }

    return this.sleep.fetchSummary(request)
  }

  fetchAllSummary(args: MeasurementCriteria): Promise<any> {
    // discriminate the required data by api
    const apis = {
      fetchFoodSummary: [], // result[0] check on datasource
      fetchActivitySummary: [],
      fetchBodySummary: [],
      fetchSleepSummary: []
    }
    args.data.forEach((data) => {
      data = this.resolveQuery(data)
      if (FoodSummaryValues.includes(data)) {
        apis.fetchFoodSummary.push(data)
      } else if (ActivitySummaryValues.includes(data)) {
        apis.fetchActivitySummary.push(data)
      } else if (BodySummaryValues.includes(data)) {
        apis.fetchBodySummary.push(data)
      } else if (SleepSummaryValues.includes(data)) {
        apis.fetchSleepSummary.push(data)
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

  resolveQuery(measurement): MeasurementSummaryData {
    // fields that depends of others
    // query a different field than the specified one
    return measurement.toString() === 'leanMass' ? 'bodyFat' : measurement
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
