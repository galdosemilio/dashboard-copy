import { Moment } from '@coachcare/datepicker'
import * as moment from 'moment'

export class DataPointSummary {
  public count: number | null = null
  public average: number | string | null = null
  public max: number | string | null = null
  public min: number | string | null = null
  public recent: number | string | null = null
  public unit: string | null = null
  public isLoading = true
  public recentDate: Moment | null = null

  update(response, id): this {
    const record = response.data.find(
      (measurement) => measurement.type.id === id
    )

    this.recent = this.applyMultiplier(
      record?.last?.value,
      record?.type?.multiplier
    )
    this.recentDate = moment(record?.last?.createdAt?.local)
    this.average = this.applyMultiplier(
      record?.average,
      record?.type?.multiplier
    )
    this.count = record?.count
    this.max = this.applyMultiplier(record?.maximum, record?.type?.multiplier)
    this.min = this.applyMultiplier(record?.minimum, record?.type?.multiplier)
    this.unit = record?.type?.unit?.display

    this.isLoading = false

    return this
  }

  applyMultiplier(value?: number, multiplier?: number) {
    if (!value) {
      return null
    }

    if (!multiplier) {
      return value
    }

    return (value / multiplier).toFixed(1)
  }
}
