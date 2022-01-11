import { BodyMeasurement } from '@app/dashboard/accounts/dieters/models/measurement/bodyMeasurement'
import * as moment from 'moment'
import { groupBy } from './generic.utils'

export interface DieterSummaryElement {
  beginning: number
  begginingMeasurement?: BodyMeasurement
  beginningString?: string
  changeThisWeek: number
  changeThisWeekString?: string
  changeThisWeekCellColor?: string
  cumulativeChange: number
  cumulativeChangeString?: string
  cumulativeChangeCellColor?: string
  currentWeek: number
  currentWeekMeasurement?: BodyMeasurement
  currentWeekString?: string
  lastWeek: number
  lastWeekMeasurement?: BodyMeasurement
  lastWeekString?: string
}

export interface GenerateCSVArgs {
  content: string
  filename: string
}

export function calculateAverageWeeklyLoss(values: any[]): number {
  const valuesCopy = values.map((val) => ({ ...val }))
  const groupedValues = groupBy(valuesCopy, (value: any) =>
    moment(value.date).week()
  )

  let average = 0

  const weekAmount = groupedValues.length

  groupedValues.forEach((week) => {
    const weight = calculateElementRow(
      { first: week[0], last: week[week.length - 1] },
      'weight'
    )
    average += weight.change
  })

  average = average / weekAmount

  return isNaN(+average) ? 0 : +average.toFixed(2)
}

export function calculateElementRow(
  meas: { first: any; last: any },
  key: string
) {
  const elementChange = +meas.last[key] - +meas.first[key]

  return {
    start: +(meas.first[key] ? meas.first[key] : 0).toFixed(2),
    current: +(meas.last[key] ? meas.last[key] : 0).toFixed(2),
    change: +(elementChange ? elementChange : 0).toFixed(2)
  }
}

export function calculateProgressElementRow(
  startDate: moment.Moment,
  measurements: BodyMeasurement[],
  key: string,
  decimals: number = 2
): DieterSummaryElement {
  const startWeekIndex = startDate.week()
  const startYear = startDate.year()

  let element: DieterSummaryElement = {
    beginning: 0,
    changeThisWeek: 0,
    cumulativeChange: 0,
    currentWeek: 0,
    lastWeek: 0
  }

  const lastWeekStartDate = startDate.clone().subtract(1, 'week')

  const lastWeekIndex = startWeekIndex === 1 ? 52 : startWeekIndex - 1
  const lastWeekIsInLastYear = lastWeekStartDate.year() < startDate.year()

  const firstMeasurement = measurements.find((meas) => meas[key])
  const currentMeasurement = measurements
    .slice()
    .reverse()
    .find((meas) => {
      const measDate = moment(meas.date)

      return (
        meas[key] &&
        measDate.week() === startWeekIndex &&
        measDate.year() === startYear
      )
    })

  const groupedMeasurements = groupBy(measurements, (meas) =>
    moment(meas.date).week()
  )

  const mostRecentMeasurement = measurements
    .slice()
    .reverse()
    .find((meas) => meas[key])

  const pertinentYear = lastWeekIsInLastYear ? startYear - 1 : startYear

  let lastWeekMeasurement = groupedMeasurements.find((group) => {
    const pertinentGroupElement = group.find((el) =>
      lastWeekIsInLastYear
        ? moment(el.date).year() === pertinentYear ||
          moment(el.date).year() === startYear
        : moment(el.date).year() === pertinentYear
    )

    if (pertinentGroupElement) {
      const groupDate = moment(pertinentGroupElement.date)

      return (
        groupDate.week() === lastWeekIndex &&
        (lastWeekIsInLastYear
          ? groupDate.year() === pertinentYear || groupDate.year() === startYear
          : groupDate.weekYear() === pertinentYear)
      )
    } else {
      return false
    }
  })

  if (lastWeekMeasurement && lastWeekMeasurement.length) {
    lastWeekMeasurement = lastWeekMeasurement
      .reverse()
      .find((meas) => meas[key])
  }

  element.beginning = firstMeasurement ? firstMeasurement[key] || 0 : null
  element.lastWeek = lastWeekMeasurement ? lastWeekMeasurement[key] : null
  element.currentWeek = currentMeasurement ? currentMeasurement[key] || 0 : null
  element.changeThisWeek =
    element.currentWeek && element.lastWeek
      ? element.currentWeek - element.lastWeek
      : null

  element.cumulativeChange = element.beginning
    ? element.currentWeek
      ? element.currentWeek - element.beginning
      : mostRecentMeasurement
      ? (mostRecentMeasurement[key] || 0) - element.beginning
      : null
    : null

  element.begginingMeasurement = firstMeasurement || null
  element.currentWeekMeasurement = currentMeasurement || null
  element.lastWeekMeasurement = lastWeekMeasurement || null

  element = {
    ...element,
    beginningString:
      element.beginning !== null ? element.beginning.toFixed(decimals) : '-',
    changeThisWeekString:
      element.changeThisWeek !== null
        ? element.changeThisWeek.toFixed(decimals)
        : '-',
    changeThisWeekCellColor: getProgressPDFCellColor(
      element.changeThisWeek || 0,
      key
    ),
    cumulativeChangeString:
      element.cumulativeChange !== null
        ? element.cumulativeChange.toFixed(decimals)
        : '-',
    cumulativeChangeCellColor: getProgressPDFCellColor(
      element.cumulativeChange || 0,
      key
    ),
    currentWeekString:
      element.currentWeek !== null
        ? element.currentWeek.toFixed(decimals)
        : '-',
    lastWeekString:
      element.lastWeek !== null ? element.lastWeek.toFixed(decimals) : '-'
  }

  return element
}

export function imageToDataURL(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0)
  const dataURL = canvas.toDataURL('image/png')
  return dataURL
}

export function generateCSV(args: GenerateCSVArgs): void {
  const csv = args.content
  const filename = args.filename.replace(/\W/gi, '_')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('visibility', 'hidden')
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function getProgressPDFCellColor(value: number, key: string): string {
  let color = 'transparent'

  if (value === 0) {
    return '#edd51c'
  }

  switch (key) {
    case 'waterPercentage':
    case 'bodyFat':
    case 'bodyFatPercentage':
    case 'weight':
    case 'totalWeightChange':
    case 'totalInchesChange':
    case 'chest':
    case 'arm':
    case 'waist':
    case 'thigh':
    case 'hip':
    case 'bmi':
    case 'visceralFatPercentage':
    case 'visceralAdiposeTissue':
    case 'visceralFatTanita':
      color = value > 0 ? '#de123e' : '#0bde51'
      break

    case 'leanMass':
      color = value > 0 ? '#0bde51' : '#de123e'
      break
  }

  return color
}
