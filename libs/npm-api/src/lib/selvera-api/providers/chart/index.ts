import * as moment from 'moment'
import { ApiService } from '../../services'
import { Goal } from '../goal'
import { FetchGoalRequest } from '../goal/requests'
import {
  ActivityMeasurementRequest,
  BodyMeasurementRequest,
  CalorieRequest,
  SleepRequest
} from './requests'
import {
  ActivityResponse,
  BmiResponse,
  BodyFatResponse,
  CalorieResponse,
  LeanMassResponse,
  SleepResponse,
  WeightResponse
} from './responses'
import { CircumferenceResponse } from './responses'

/**
 * Chart provider to fetch chart data and summaries
 */
class Chart {
  private goal: Goal

  /**
   * Init Api Service
   */
  public constructor(private readonly apiService: ApiService) {
    this.goal = new Goal(apiService)
  }

  /**
   * Fetch activity chart summary
   * @param fetchActivityRequest must implement FetchActivityRequest
   * @returns ActivityResponse
   */
  public async activity(
    fetchActivityRequest: ActivityMeasurementRequest
  ): Promise<ActivityResponse> {
    const activityRequest = {
      clientId: fetchActivityRequest.account,
      data: ['steps', 'distance'],
      startDate: fetchActivityRequest.startDate,
      endDate: fetchActivityRequest.endDate,
      max: fetchActivityRequest.max,
      unit: fetchActivityRequest.unit,
      device: fetchActivityRequest.device
    }

    const goalRequest: FetchGoalRequest = {
      account:
        fetchActivityRequest.account !== undefined
          ? fetchActivityRequest.account
          : undefined
    }

    const request = [
      this.apiService.request({
        endpoint: `/measurement/activity/summary`,
        method: `GET`,
        data: activityRequest
      }),
      this.goal.fetch(goalRequest)
    ]

    return Promise.all(request).then((response) => {
      const [activity, goal] = response
      return {
        data: activity.data,
        summary: {
          current: activity.data.length
            ? activity.data.slice().reverse()[0].stepTotal
            : 0,
          average: activity.summary.stepsAverage,
          goal: goal.goal.dailyStep
        }
      }
    })
  }

  /**
   * Fetch sleep chart and summary
   * @param fetchSleepRequest must implement SleepRequest
   * @returns SleepResponse
   */
  public async sleep(fetchSleepRequest: SleepRequest): Promise<SleepResponse> {
    const sleepRequest = {
      clientId: fetchSleepRequest.account,
      data: ['total', 'average', 'sleepQuality'],
      startDate: fetchSleepRequest.startDate,
      endDate: fetchSleepRequest.endDate,
      max: fetchSleepRequest.max,
      unit: fetchSleepRequest.unit
    }

    const goalRequest: FetchGoalRequest = {
      account:
        fetchSleepRequest.account !== undefined
          ? fetchSleepRequest.account
          : undefined
    }

    const request = [
      this.apiService.request({
        endpoint: `/measurement/sleep/summary`,
        method: `GET`,
        data: sleepRequest
      }),
      this.goal.fetch(goalRequest)
    ]

    return Promise.all(request).then((response) => {
      const [sleep, goal] = response
      const data = sleep.data.map((item: any) => {
        return {
          date: item.date,
          duration: moment.duration(item.sleepMinutes, 'second').asHours(),
          average: moment.duration(item.averageMinutes, 'second').asHours(),
          quality: item.sleepQuality
        }
      })

      const current = sleep.data.length
        ? moment
            .duration(sleep.data.slice().reverse()[0].sleepMinutes, 'second')
            .asHours()
        : 0
      const average = sleep.data.length
        ? moment
            .duration(sleep.data.slice().reverse()[0].averageMinutes, 'second')
            .asHours()
        : 0

      return {
        data: data,
        summary: {
          current: current,
          average: average,
          goal: goal.goal.dailySleep
        }
      }
    })
  }

  /**
   * Fetch calorie chart and summary
   * @param fetchCalorieRequest must implement CalorieRequest
   * @returns CalorieResponse
   */
  public async calorie(
    fetchCalorieRequest: CalorieRequest
  ): Promise<CalorieResponse> {
    fetchCalorieRequest.noLimit = true

    return this.apiService
      .request({
        endpoint: `/food/consumed`,
        method: 'GET',
        data: fetchCalorieRequest
      })
      .then((response) => {
        const meals = response.meals.reduce((acc: any, next: any) => {
          const lastItemIndex = acc.length - 1
          const accHasContent = acc.length >= 1

          if (accHasContent && acc[lastItemIndex].date === next.consumed_date) {
            acc[lastItemIndex].calories += next.calories
          } else {
            acc[lastItemIndex + 1] = {
              date: next.consumed_date,
              calories: next.calories,
              carbohydrate: next.calories,
              fat: next.total_fat,
              protein: next.protein
            }
          }
          return acc
        }, [])

        const current = meals.length ? meals[0].calories : 0
        const average = meals.length
          ? Math.round(
              meals.reduce((sum: any, value: any) => sum + value.calories, 0) /
                meals.length
            )
          : 0

        return {
          data: meals,
          summary: {
            current: current,
            average: average
          }
        }
      })
  }

  /**
   * Fetch lean mass chart and summary
   * @param fetchLeanMassRequest must implement BodyMeasurementRequest
   * @returns LeanMassResponse
   */
  public async leanMass(
    fetchLeanMassRequest: BodyMeasurementRequest
  ): Promise<LeanMassResponse> {
    fetchLeanMassRequest.data = ['weight', 'bodyFat', 'fatMassWeight']

    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchLeanMassRequest
      })
      .then((response) => {
        const data = response.data.map((item: any) => {
          let mass = 0,
            percentage = 0
          // FIXME: for some reasons fatMassWeight always 0, that's why we calculate it manually
          const fatMassWeight = Math.round(
            (item.weight * item.bodyFat) / 100000
          )
          if (item.weight > 0 && fatMassWeight > 0) {
            percentage =
              Math.round(((item.weight - fatMassWeight) / item.weight) * 1000) /
              10
            mass = item.weight - fatMassWeight
          }
          return {
            date: item.date,
            percentage: percentage,
            mass: mass
          }
        })

        let initial = data.find((item: any) => item.mass > 0)
        let current = data
          .slice()
          .reverse()
          .find((item: any) => item.mass > 0)

        if (initial === undefined && data.length) {
          initial = data[0]
        }

        if (current === undefined && data.length) {
          current = data.slice().reverse()[0]
        }

        const error = initial === undefined || current === undefined
        const summary = {
          currentPercentage: error ? 0 : current.percentage,
          firstPercentage: error ? 0 : initial.percentage,
          changePercentage: error ? 0 : initial.percentage - current.percentage,
          currentMass: error ? 0 : current.mass,
          firstMass: error ? 0 : initial.mass,
          changeMass: error ? 0 : initial.mass - current.mass
        }

        return {
          data: data,
          summary: summary
        }
      })
  }

  /**
   * Fetch bmi chart and summary
   * @param fetchBmiRequest must implement BodyMeasurementRequest
   * @returns BmiResponse
   */
  public async bmi(
    fetchBmiRequest: BodyMeasurementRequest
  ): Promise<BmiResponse> {
    fetchBmiRequest.data = ['bmi']

    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchBmiRequest
      })
      .then((response) => {
        const data = response.data.map((item: any) => {
          return {
            date: item.date,
            bmi: item.bmi
          }
        })

        let initial = data.find((item: any) => item.bmi > 0)
        let current = data
          .slice()
          .reverse()
          .find((item: any) => item.bmi > 0)

        if (initial === undefined && data.length) {
          initial = data[0]
        }

        if (current === undefined && data.length) {
          current = data.slice().reverse()[0]
        }

        const error = initial === undefined || current === undefined
        const summary = {
          currentBmi: error ? 0 : current.bmi,
          firstBmi: error ? 0 : initial.bmi,
          changeBmi: error ? 0 : initial.bmi - current.bmi
        }

        return {
          data: data,
          summary: summary
        }
      })
  }

  /**
   * Fetch body fat chart data and request
   * @param fetchBodyFatRequest must implement BodyMeasurementRequest
   * @returns BodyFatResponse
   */
  public async bodyFat(
    fetchBodyFatRequest: BodyMeasurementRequest
  ): Promise<BodyFatResponse> {
    fetchBodyFatRequest.data = ['bodyFat', 'fatMassWeight', 'weight']

    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchBodyFatRequest
      })
      .then((response) => {
        const data = response.data.map((item: any) => {
          // FIXME: for some reasons fatMassWeight always 0, that's why we calculate it manually
          return {
            date: item.date,
            percentage: Math.round(item.bodyFat / 100) / 10,
            mass: Math.round((item.weight * item.bodyFat) / 100000)
          }
        })

        let initial = data.find((item: any) => item.mass > 0)
        let current = data
          .slice()
          .reverse()
          .find((item: any) => item.mass > 0)

        if (initial === undefined && data.length) {
          initial = data[0]
        }

        if (current === undefined && data.length) {
          current = data.slice().reverse()[0]
        }

        const error = initial === undefined || current === undefined
        const summary = {
          currentPercentage: error ? 0 : current.percentage,
          firstPercentage: error ? 0 : initial.percentage,
          changePercentage: error ? 0 : initial.percentage - current.percentage,
          currentMass: error ? 0 : current.mass,
          firstMass: error ? 0 : initial.mass,
          changeMass: error ? 0 : initial.mass - current.mass
        }

        return {
          data: data,
          summary: summary
        }
      })
  }

  /**
   * Fetch weight chart data and summary
   * @param fetchWeightRequest must implement BodyMeasurementRequest
   * @returns WeightResponse
   */
  public async weight(
    fetchWeightRequest: BodyMeasurementRequest
  ): Promise<WeightResponse> {
    fetchWeightRequest.data = ['weight', 'bodyFat', 'fatMassWeight']

    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchWeightRequest
      })
      .then((response) => {
        const data = response.data.map((item: any) => {
          // FIXME: for some reasons fatMassWeight always 0, that's why we calculate it manually
          return {
            date: item.date,
            weight: item.weight,
            bodyFat: item.bodyFat,
            leanMass:
              item.weight > 0 && item.bodyFat > 0
                ? item.weight -
                  Math.round((item.weight * item.bodyFat) / 100000)
                : 0
          }
        })

        let initial = data.find((item: any) => item.weight > 0)
        let current = data
          .slice()
          .reverse()
          .find((item: any) => item.weight > 0)

        if (initial === undefined && data.length) {
          initial = data[0]
        }

        if (current === undefined && data.length) {
          current = data.slice().reverse()[0]
        }

        const error = initial === undefined || current === undefined
        const summary = {
          currentMass: error ? 0 : current.weight,
          firstMass: error ? 0 : initial.weight,
          changeMass: error ? 0 : initial.weight - current.weight
        }

        return {
          data: data,
          summary: summary
        }
      })
  }

  /**
   * Fetch circumference chart data
   * @param fetchCircumferenceRequest must implement BodyMeasurementRequest
   * @returns CircumferenceResponse
   */
  public async circumference(
    fetchCircumferenceRequest: BodyMeasurementRequest
  ): Promise<CircumferenceResponse> {
    fetchCircumferenceRequest.data = [
      'waist',
      'arm',
      'hip',
      'chest',
      'thigh',
      'neck',
      'thorax'
    ]

    return this.apiService
      .request({
        endpoint: `/measurement/body/summary`,
        method: 'GET',
        data: fetchCircumferenceRequest
      })
      .then((response) => {
        const data = []

        for (const item of response.data) {
          if (
            (item.waist !== null && item.waist > 0) ||
            (item.arm !== null && item.arm > 0) ||
            (item.hip !== null && item.hip > 0) ||
            (item.chest !== null && item.chest > 0) ||
            (item.thigh !== null && item.thigh > 0) ||
            (item.neck !== null && item.neck > 0) ||
            (item.thorax !== null && item.thorax > 0)
          ) {
            data.push({
              date: moment.utc(item.date).format('YYYY-MM-DD'),
              waist: item.waist || 0,
              arm: item.arm || 0,
              hip: item.hip || 0,
              chest: item.chest || 0,
              thigh: item.thigh || 0,
              neck: item.neck || 0,
              thorax: item.thorax || 0
            })
          }
        }

        return {
          data: data
        }
      })
  }
}

export { Chart }
