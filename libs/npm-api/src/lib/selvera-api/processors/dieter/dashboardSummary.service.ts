import { fromPairs } from 'lodash'
import { ClientData } from '../../providers/account/entities'
import { AccSingleResponse } from '../../providers/account/responses'
import { MeasurementDataPointSummaryItem } from '../../providers/measurement/body/entities'
import { Account, Goal, MeasurementBody } from '../../services'

import * as momentNs from 'moment-timezone'
import { PagedResponse } from '../../providers/content/entities'
import { BODY_MEASUREMENT_TYPES } from './model'
const moment = momentNs

export class DieterDashboardSummary {
  public isLoading = true
  public isBMRLoading = true

  public dieter: AccSingleResponse
  public activityLevel: number | undefined

  public BMR: number | undefined
  public haveBMRData = false
  public goalData: any | undefined
  public remainingWeightGoal: number | undefined

  public starting: any = {}
  public current: any = {}
  public change: any = {}
  public timestamp: any = { starting: {}, current: {} }

  public constructor(
    private account: Account,
    private measurementBody: MeasurementBody,
    private goal: Goal
  ) {}

  public init(dieterId: string, activityLevel?: number): Promise<void> {
    // TODO optimize with account.getSingle cache
    this.isLoading = true
    this.isBMRLoading = true
    this.BMR = undefined
    this.haveBMRData = false
    this.starting = {}
    this.current = {}

    return this.getMetricData(dieterId, activityLevel)
  }

  public update(activityLevel: number): void {
    this.isBMRLoading = true

    this.calcBMRStat(activityLevel)
  }

  private calcBMRStat(activityLevel?: number): void {
    this.isBMRLoading = true

    const data: Partial<ClientData> = this.dieter.clientData || {}

    // update the activityLevel if passed
    if (activityLevel !== undefined) {
      this.account
        .update({
          id: this.dieter.id,
          client: {
            bmr: activityLevel
          }
        })
        .catch(console.error)
    } else if (!activityLevel) {
      activityLevel =
        data.bmr !== undefined ? (data.bmr !== null ? data.bmr : -1) : -1
    }
    this.activityLevel = activityLevel === null ? -1 : activityLevel

    // calculate the BMR
    const weightKg = this.current.weight ? this.current.weight / 1000 : 0
    const heightCm = data.height ? data.height : 0
    const age = data.birthday
      ? moment().diff(moment(data.birthday), 'years')
      : 0

    if (!weightKg || !heightCm || !age) {
      this.haveBMRData = false
      this.isBMRLoading = false
      return
    }

    // factor based on activity level
    const factor = !this.activityLevel
      ? 1.2
      : this.activityLevel === -1
      ? 1
      : this.activityLevel < 4
      ? 1.375
      : this.activityLevel < 6
      ? 1.55
      : this.activityLevel < 8
      ? 1.725
      : 1.9

    // formula: https://www.verywellfit.com/basal-metabolic-rate-1229751
    this.BMR =
      data.gender === 'female'
        ? Math.round(
            (weightKg * 9.25 + 447.6 + heightCm * 3.1 - age * 4.33) * factor
          )
        : Math.round(
            (weightKg * 13.4 + 88.4 + heightCm * 4.8 - age * 5.68) * factor
          )

    this.haveBMRData = true
    this.isBMRLoading = false
  }

  private getMetricData(
    dieterId: string,
    activityLevel?: number
  ): Promise<void> {
    return Promise.all([
      this.measurementBody.getDataPointSummary({
        account: dieterId,
        type: Object.values(BODY_MEASUREMENT_TYPES).map((type) => type.id)
      }),
      this.goal.fetch({ account: dieterId }),
      this.account.getSingle(dieterId),
      this.measurementBody.getDataPointSummary({
        account: dieterId,
        type: Object.values(BODY_MEASUREMENT_TYPES)
          .filter((type) => ['weight', 'bodyFat'].includes(type.name))
          .map((type) => type.id),
        mode: 'in-group'
      })
    ])
      .then(([dataPointSummary, goal, dieter, inGroupDataPointSummary]) => {
        this.populateData(dataPointSummary, inGroupDataPointSummary)
        this.dieter = dieter
        this.calcBMRStat(activityLevel)

        const weightGoal =
          goal && goal.goal && goal.goal.weight ? goal.goal.weight : null

        this.remainingWeightGoal =
          weightGoal && this.current.weight
            ? Number(
                (Number(this.current.weight) - Number(weightGoal)).toFixed(1)
              )
            : undefined

        this.isLoading = false
      })
      .catch(console.error)
  }

  private populateData(
    summary: PagedResponse<MeasurementDataPointSummaryItem>,
    inGroupSummary: PagedResponse<MeasurementDataPointSummaryItem>
  ): void {
    const data: {
      [field: string]: MeasurementDataPointSummaryItem
    } = fromPairs(
      Object.values(BODY_MEASUREMENT_TYPES).map((type) => [
        type.name,
        summary.data.find((entry) => entry.type.id.toString() === type.id)
      ])
    )

    const inGroupData: {
      [field: string]: MeasurementDataPointSummaryItem
    } = fromPairs(
      Object.values(BODY_MEASUREMENT_TYPES).map((type) => [
        type.name,
        inGroupSummary.data.find(
          (entry) => entry.type.id.toString() === type.id
        )
      ])
    )

    if (data.bmi) {
      this.change['bmi'] = data.bmi.change.value
      const bmi = data.bmi
      this.starting.BMI = (
        Number(bmi.first.value) / bmi.first.type.multiplier
      ).toFixed(1)
      this.current.BMI = (
        Number(bmi.last.value) / bmi.last.type.multiplier
      ).toFixed(1)
      this.timestamp.starting.BMI = bmi.first.createdAt.utc
      this.timestamp.current.BMI = bmi.last.createdAt.utc
    } else {
      this.starting.BMI = this.current.BMI = null
      this.timestamp.starting.BMI = this.timestamp.current.BMI = null
    }

    if (data.weight) {
      this.change['weight'] = data.weight.change.value
      const weight = data.weight
      const sweight = (this.starting.weight = weight.first.value)
      const cweight = (this.current.weight = weight.last.value)

      this.timestamp.starting.weight = weight.first.createdAt.utc
      this.timestamp.current.weight = weight.last.createdAt.utc

      // Body Fat and Lean Mass Calculations
      if (inGroupData.bodyFat) {
        const weightDataPoint = inGroupData.weight
        const bodyFatDataPoint = inGroupData.bodyFat

        this.change['bodyFat'] = bodyFatDataPoint.change.value
        this.starting.bodyFat =
          weightDataPoint.first.value *
          (bodyFatDataPoint.first.value /
            bodyFatDataPoint.type.multiplier /
            100)
        this.starting.bodyFatPercentage =
          bodyFatDataPoint.first.value / bodyFatDataPoint.type.multiplier
        this.current.bodyFat =
          weightDataPoint.last.value *
          (bodyFatDataPoint.last.value / bodyFatDataPoint.type.multiplier / 100)
        this.current.bodyFatPercentage =
          bodyFatDataPoint.last.value / bodyFatDataPoint.type.multiplier

        // Timestamps for Body Fat / Body Fat Percentage
        this.timestamp.starting.bodyFat = bodyFatDataPoint.first.createdAt.utc
        this.timestamp.current.bodyFat = bodyFatDataPoint.last.createdAt.utc
        this.timestamp.starting.bodyFatPercentage =
          bodyFatDataPoint.first.createdAt.utc
        this.timestamp.current.bodyFatPercentage =
          bodyFatDataPoint.last.createdAt.utc
        this.change['leanMass'] =
          weightDataPoint.last.value - this.change['bodyFat']
        this.starting.leanMass =
          weightDataPoint.first.value - this.starting.bodyFat
        this.current.leanMass =
          weightDataPoint.last.value - this.current.bodyFat

        // Timestamps for Lean Mass
        this.timestamp.starting.leanMass = bodyFatDataPoint.first.createdAt.utc
        this.timestamp.current.leanMass = bodyFatDataPoint.last.createdAt.utc
      }

      if (data.hydration) {
        this.change['hydration'] = data.hydration.change.value
        const hydration = data.hydration
        this.starting.waterMass = hydration.first.value
          ? (sweight * hydration.first.value) / 100000
          : null
        this.current.waterMass = hydration.last.value
          ? (cweight * hydration.last.value) / 100000
          : null

        this.timestamp.starting.waterMass = hydration.first.createdAt.utc
        this.timestamp.current.waterMass = hydration.last.createdAt.utc
      }
    } else {
      this.starting.weight = this.current.weight = null
      this.starting.bodyFat = this.current.bodyFat = null
      this.starting.bodyFatPercentage = this.current.bodyFatPercentage = null
      this.starting.leanMass = this.current.leanMass = null
      this.starting.waterMass = this.current.waterMass = null

      this.timestamp.starting.weight = this.timestamp.current.weight = null
      this.timestamp.starting.bodyFat = this.timestamp.current.bodyFat = null
      this.timestamp.starting.bodyFatPercentage = this.timestamp.current.bodyFatPercentage = null
      this.timestamp.starting.leanMass = this.timestamp.current.leanMass = null
      this.timestamp.starting.waterMass = this.timestamp.current.waterMass = null
    }
  }
}
