import { unitConversion } from '@app/shared'
import { AccountMeasurementPreferenceType, Entity } from '@coachcare/sdk'
import * as moment from 'moment'

interface Device {
  description?: string
  id: string
  title: string
}

const DEVICES: Device[] = [
  {
    id: '2',
    title: 'Selvera Body Composition Scale'
  },
  {
    id: '4',
    title: 'Strive Activity Tracker'
  },
  {
    id: '5',
    title: 'Selvera Balance'
  },
  {
    id: '10',
    title: 'Balance Smart Scale'
  }
]

const formatFoodProperties = (value, timeframe, thousands = true) => {
  return value
    ? ['month', 'year'].includes(timeframe)
      ? thousands
        ? value.dailyAverage / 1000
        : value.dailyAverage
      : thousands
      ? value.total / 1000
      : value.total
    : 0
}

const overrideDevice = (device): Device => {
  return device ? DEVICES.find((dev) => dev.id === device.id) || device : device
}

interface BodyMeasurementConstructorOptions {
  measurementPreference?: AccountMeasurementPreferenceType
  timeframe?: string
}

export class BodyMeasurement {
  account: Entity
  arm: number
  bloodPressureDiastolic: number
  bloodPressureString: string
  bloodPressureSystolic: number
  bmi: number
  bodyFat: number
  bodyFatPercentage: number
  calories: number
  carbohydrates: number
  chest: number
  date?: string
  device: Device
  extracellularWaterToBodyWater?: number
  even?: boolean
  distanceTotal: number
  distanceAverage: number
  fastingGlucose: number
  hba1c: number
  hdl: number
  heartRate: number
  hip: number
  hsCrp: number
  id: string
  insulin: number
  isEmpty?: boolean
  isHeader?: boolean
  ketones?: number
  ldl: number
  leanMass: number
  leanMassPercentage: number
  neck: number
  odd?: boolean
  protein: number
  recordedAt: string
  respirationRate: number
  sleepMinutes: number
  sleepQuality: number
  stepAverage: number
  stepTotal: number
  thigh: number
  thorax: number
  totalBodyWater?: number
  totalCholesterol: number
  totalFat: number
  temperature: number
  triglycerides: number
  updatedAt: string
  usesNewAPI: boolean
  visceralAdiposeTissue?: number
  visceralFat: number
  visceralFatMass?: number
  visceralFatPercentage: number
  visceralFatTanita: number
  vldl: number
  water: number
  waterPercentage: number
  waist: number
  weight: number

  constructor(args: any, opts: BodyMeasurementConstructorOptions = {}) {
    const units = opts.measurementPreference
    const overrideToLocalTime =
      args.recordedAt && args.recordedAt.indexOf('00:00:00.000Z') > -1
    this.account = args.account || undefined
    this.weight = unitConversion(
      units,
      'composition',
      Number(args.weight || 0),
      false
    )
    this.arm = unitConversion(
      units,
      'circumference',
      Number(args.arm || 0),
      false
    )
    this.bloodPressureDiastolic = args.bloodPressureDiastolic || 0
    this.bloodPressureSystolic = args.bloodPressureSystolic || 0
    this.bloodPressureString =
      this.bloodPressureDiastolic && this.bloodPressureSystolic
        ? `${this.bloodPressureSystolic}/${this.bloodPressureDiastolic}`
        : ''
    this.bmi = Number(args.bmi ? args.bmi / 1000 : 0)
    this.bodyFatPercentage = Number(args.bodyFat ? args.bodyFat / 1000 : 0)
    this.bodyFat =
      this.weight && this.bodyFatPercentage
        ? this.weight * (this.bodyFatPercentage / 100)
        : 0
    this.chest = unitConversion(
      units,
      'circumference',
      Number(args.chest || 0),
      false
    )
    this.calories = args.calories
      ? typeof args.calories === 'object'
        ? formatFoodProperties(args.calories, opts.timeframe, false)
        : args.calories
      : 0
    this.carbohydrates = args.carbohydrates
      ? typeof args.carbohydrates === 'object'
        ? formatFoodProperties(args.carbohydrates, opts.timeframe)
        : args.carbohydrates
      : 0
    this.date = args.recordedAt || args.date
    this.device = overrideDevice(args.device)
    this.even = args.even || false
    this.extracellularWaterToBodyWater = args.extracellularWaterToBodyWater
      ? args.extracellularWaterToBodyWater / 1000
      : 0
    this.distanceTotal = args.distanceTotal || 0
    this.distanceAverage = args.distanceAverage || 0
    this.fastingGlucose = args.fastingGlucose || 0
    this.hba1c = (args.hba1c > 100 ? args.hba1c / 1000 : args.hba1c) || 0
    this.hdl = args.hdl || 0
    this.heartRate = args.heartRate || 0
    this.hip = unitConversion(
      units,
      'circumference',
      Number(args.hip || 0),
      false
    )
    this.hsCrp = (args.hsCrp > 100 ? args.hsCrp / 10000 : args.hsCrp) || 0
    this.id = args.id
    this.insulin = args.insulin || 0
    this.isEmpty = args.isEmpty || false
    this.isHeader = args.isHeader || false
    this.ketones = args.ketones ? Number(args.ketones) / 1000 : 0
    this.ldl = args.ldl || 0
    this.leanMassPercentage = this.bodyFatPercentage
      ? 100 - this.bodyFatPercentage
      : 0
    this.leanMass = this.weight && this.bodyFat ? this.weight - this.bodyFat : 0
    this.neck = unitConversion(
      units,
      'circumference',
      Number(args.neck || 0),
      false
    )
    this.odd = args.odd || false
    this.protein = args.protein
      ? typeof args.protein === 'object'
        ? formatFoodProperties(args.protein, opts.timeframe)
        : args.protein
      : 0
    this.recordedAt = overrideToLocalTime
      ? moment(args.recordedAt.split('T')[0]).toISOString()
      : args.recordedAt
    this.respirationRate = args.respirationRate || 0
    this.sleepMinutes = args.sleepMinutes || 0
    this.sleepQuality = args.sleepQuality || 0
    this.stepAverage = args.stepAverage || 0
    this.stepTotal = args.stepTotal || 0
    this.temperature =
      (args.temperature > 100 ? args.temperature / 100 : args.temperature) || 0
    this.temperature =
      this.temperature !== 0
        ? unitConversion(units, 'temperature-fetch', this.temperature || 0, 1)
        : 0
    this.thigh = unitConversion(
      units,
      'circumference',
      Number(args.thigh || 0),
      false
    )
    this.thorax = unitConversion(
      units,
      'circumference',
      Number(args.thorax || 0),
      false
    )
    this.totalBodyWater = args.totalBodyWater || 0
    this.totalCholesterol = args.totalCholesterol || 0
    this.totalFat = args.totalFat
      ? typeof args.totalFat === 'object'
        ? formatFoodProperties(args.totalFat, opts.timeframe)
        : args.totalFat
      : 0
    this.triglycerides = args.triglycerides || 0
    this.updatedAt = args.updatedAt
    this.usesNewAPI = args.usesNewAPI || false
    this.visceralAdiposeTissue = args.visceralAdiposeTissue
      ? args.visceralAdiposeTissue / 1000
      : 0
    this.visceralFat =
      this.weight && this.visceralFatPercentage
        ? this.weight * (this.visceralFatPercentage / 100)
        : 0
    this.visceralFatMass = args.visceralFatMass || 0

    this.visceralFatPercentage = Number(
      this.visceralFatMass && this.visceralFatMass > 0
        ? (unitConversion(units, 'composition', this.visceralFatMass, false) /
            this.weight) *
            100
        : args.visceralFatPercentage && args.visceralFatPercentage > 0
        ? args.visceralFatPercentage / 1000
        : 0
    )
    this.visceralFatTanita = Number(args.visceralFatTanita || 0)
    this.vldl = args.vldl || 0
    this.waist = unitConversion(
      units,
      'circumference',
      Number(args.waist || 0),
      false
    )
    this.waterPercentage = Number(
      args.waterPercentage ? args.waterPercentage / 1000 : 0
    )
    this.water =
      this.weight && this.waterPercentage
        ? this.weight * (this.waterPercentage / 100)
        : 0
  }

  static calculateAverage(
    measurements: BodyMeasurement[],
    opts: BodyMeasurementConstructorOptions = {}
  ): BodyMeasurement {
    const excludedProps = ['recordedAt', 'updatedAt', 'date']
    const average: BodyMeasurement = new BodyMeasurement(
      {
        recordedAt: measurements[0].recordedAt,
        updatedAt: measurements[0].updatedAt
      },
      opts
    )

    measurements.forEach((measurement: BodyMeasurement) => {
      Object.keys(measurement).forEach((key) => {
        if (!Number.isNaN(average[key]) && excludedProps.indexOf(key) === -1) {
          average[key] += measurement[key]
        }
      })
    })

    Object.keys(average).forEach((key) => {
      if (!Number.isNaN(average[key]) && excludedProps.indexOf(key) === -1) {
        average[key] = average[key] / measurements.length
      }
    })

    return average
  }
}
