import { fromPairs } from 'lodash'
import { ClientData } from '../../providers/account/entities'
import { AccSingleResponse } from '../../providers/account/responses'
import { SummaryElement } from '../../providers/measurement/body/entities'
import { GetSummaryMeasurementBodyRequest } from '../../providers/measurement/body/requests'
import { GetSummaryMeasurementBodyResponse } from '../../providers/measurement/body/responses'
import { Account, Goal, MeasurementBody } from '../../services'

import * as momentNs from 'moment-timezone'
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
    // body summary request
    const starting: GetSummaryMeasurementBodyRequest = {
      account: dieterId
      // TODO include start/end date from current Phase if exists
    }

    return Promise.all([
      this.measurementBody.getSummary(starting),
      this.goal.fetch({ account: dieterId }),
      this.account.getSingle(dieterId)
    ])
      .then(([summary, goal, dieter]) => {
        this.populateData(summary)
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

  private populateData(summary: GetSummaryMeasurementBodyResponse): void {
    const data: { [field: string]: SummaryElement } = fromPairs(
      summary.data.map((v) => [v.key, v.value])
    )

    if (data.bmi) {
      this.change['bmi'] = data.bmi.change
      const bmi = data.bmi.record
      this.starting.BMI = (Number(bmi.first.value) / 1000).toFixed(1)
      this.current.BMI = (Number(bmi.last.value) / 1000).toFixed(1)
    } else {
      this.starting.BMI = this.current.BMI = null
    }

    if (data.weight) {
      this.change['weight'] = data.weight.change
      const weight = data.weight.record
      const sweight = (this.starting.weight = weight.first.value)
      const cweight = (this.current.weight = weight.last.value)
      if (data.bodyFat) {
        this.change['bodyFat'] = data.bodyFat.change
        const bodyFat = data.bodyFat.record
        this.starting.bodyFat = (sweight * bodyFat.first.value) / 100000
        this.starting.bodyFatPercentage = bodyFat.first.value
        this.current.bodyFat = (cweight * bodyFat.last.value) / 100000
        this.current.bodyFatPercentage = bodyFat.last.value
      }
      if (data.leanMass) {
        this.change['leanMass'] = data.leanMass.change
        const leanMass = data.leanMass.record
        this.starting.leanMass = (sweight * leanMass.first.value) / 100000
        this.current.leanMass = (cweight * leanMass.last.value) / 100000
      }
      if (data.hydration) {
        this.change['hydration'] = data.hydration.change
        const hydration = data.hydration.record
        this.starting.waterMass = hydration.first.value
          ? (sweight * hydration.first.value) / 100000
          : null
        this.current.waterMass = hydration.last.value
          ? (cweight * hydration.last.value) / 100000
          : null
      }
    } else {
      this.starting.weight = this.current.weight = null
      this.starting.bodyFat = this.current.bodyFat = null
      this.starting.bodyFatPercentage = this.current.bodyFatPercentage = null
      this.starting.leanMass = this.current.leanMass = null
      this.starting.waterMass = this.current.waterMass = null
    }
  }
}
