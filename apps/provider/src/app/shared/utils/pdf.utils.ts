import {
  convertToReadableFormat,
  DataPointTypes,
  MeasurementDataPointSummaryEntry
} from '@coachcare/sdk'
import { DataPoint } from '@coachcare/sdk/dist/lib/providers/measurement/dataPoint/entities/dataPoint'
import { UserMeasurementPreferenceType } from '@coachcare/sdk/dist/lib/providers/user/requests/userMeasurementPreference.type'

export interface DieterSummaryElement {
  beginning: number
  beginningMeasurement?: DataPoint
  beginningString?: string
  changeThisWeek: number
  changeThisWeekString?: string
  changeThisWeekCellColor?: string
  cumulativeChange: number
  cumulativeChangeString?: string
  cumulativeChangeCellColor?: string
  currentWeek: number
  currentWeekMeasurement?: DataPoint
  currentWeekString?: string
  lastWeek: number
  lastWeekMeasurement?: DataPoint
  lastWeekString?: string
}

export function calculateProgressElementRow(
  allTimeSummary: MeasurementDataPointSummaryEntry[],
  lastWeekSummary: MeasurementDataPointSummaryEntry[],
  currentWeekSummary: MeasurementDataPointSummaryEntry[],
  type: DataPointTypes,
  measPref: UserMeasurementPreferenceType,
  decimals: number = 2
): DieterSummaryElement {
  let element: DieterSummaryElement = {
    beginning: 0,
    changeThisWeek: 0,
    cumulativeChange: 0,
    currentWeek: 0,
    lastWeek: 0
  }

  const firstMeasurement =
    allTimeSummary.find((aggregate) => aggregate.first.type.id === type)
      ?.first ?? null

  const currentWeekMeasurement =
    currentWeekSummary.find((aggregate) => aggregate.type.id === type)?.last ??
    null

  const mostRecentMeasurement =
    allTimeSummary.find((aggregate) => aggregate.last.type.id === type)?.last ??
    null

  const lastWeekMeasurement =
    lastWeekSummary.find((aggregate) => aggregate.type.id === type)?.last ??
    null

  const measType = firstMeasurement?.type

  element.beginning = firstMeasurement
    ? convertToReadableFormat(firstMeasurement.value, measType, measPref) || 0
    : null
  element.lastWeek = lastWeekMeasurement
    ? convertToReadableFormat(lastWeekMeasurement.value, measType, measPref)
    : null
  element.currentWeek = currentWeekMeasurement
    ? convertToReadableFormat(
        currentWeekMeasurement.value,
        measType,
        measPref
      ) || 0
    : null
  element.changeThisWeek =
    element.currentWeek && element.lastWeek
      ? element.currentWeek - element.lastWeek
      : null

  element.cumulativeChange = element.beginning
    ? element.currentWeek
      ? element.currentWeek - element.beginning
      : mostRecentMeasurement
      ? convertToReadableFormat(
          mostRecentMeasurement.value || 0,
          measType,
          measPref
        ) - element.beginning
      : null
    : null

  element.beginningMeasurement = firstMeasurement || null
  element.currentWeekMeasurement = currentWeekMeasurement || null
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
      type
    ),
    cumulativeChangeString:
      element.cumulativeChange !== null
        ? element.cumulativeChange.toFixed(decimals)
        : '-',
    cumulativeChangeCellColor: getProgressPDFCellColor(
      element.cumulativeChange || 0,
      type
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

export function calculateRowBasedOnWeight(
  weightSummary: DieterSummaryElement,
  otherSummary: DieterSummaryElement,
  elementType: 'bodyFat' | 'leanMass',
  decimals: number = 2
): DieterSummaryElement {
  let element: DieterSummaryElement = {
    beginning: 0,
    changeThisWeek: 0,
    cumulativeChange: 0,
    currentWeek: 0,
    lastWeek: 0
  }
  element.beginning =
    weightSummary.beginning !== null && otherSummary.beginning !== null
      ? weightSummary.beginning * (otherSummary.beginning / 100)
      : null

  element.lastWeek =
    weightSummary.lastWeek !== null && otherSummary.lastWeek !== null
      ? weightSummary.lastWeek * (otherSummary.lastWeek / 100)
      : null

  element.currentWeek =
    weightSummary.currentWeek !== null && otherSummary.currentWeek !== null
      ? weightSummary.currentWeek * (otherSummary.currentWeek / 100)
      : null

  element.changeThisWeek =
    element.currentWeek !== null && element.lastWeek !== null
      ? element.currentWeek - element.lastWeek
      : null

  element.cumulativeChange =
    element.beginning !== null && element.currentWeek !== null
      ? element.currentWeek - element.beginning
      : null

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
      elementType
    ),
    cumulativeChangeString:
      element.cumulativeChange !== null
        ? element.cumulativeChange.toFixed(decimals)
        : '-',
    cumulativeChangeCellColor: getProgressPDFCellColor(
      element.cumulativeChange || 0,
      elementType
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

export function getProgressPDFCellColor(
  value: number,
  type:
    | DataPointTypes
    | 'totalInchesChange'
    | 'totalWeightChange'
    | 'leanMass'
    | 'bodyFat'
): string {
  let color = 'transparent'

  if (value === 0) {
    return '#edd51c'
  }

  switch (type) {
    case DataPointTypes.WATER_PERCENTAGE:
    case 'bodyFat':
    case DataPointTypes.BODY_FAT_PERCENTAGE:
    case DataPointTypes.WEIGHT:
    case 'totalWeightChange':
    case 'totalInchesChange':
    case DataPointTypes.CHEST_CIRCUMFERENCE:
    case DataPointTypes.ARM_CIRCUMFERENCE:
    case DataPointTypes.WAIST_CIRCUMFERENCE:
    case DataPointTypes.THIGH_CIRCUMFERENCE:
    case DataPointTypes.HIP_CIRCUMFERENCE:
    case DataPointTypes.BMI:
    case DataPointTypes.VISCERAL_FAT_PERCENTAGE:
    case DataPointTypes.VISCERAL_ADIPOSE_TISSUE:
    case DataPointTypes.VISCERAL_FAT_TANITA:
      color = value > 0 ? '#de123e' : '#0bde51'
      break

    case 'leanMass':
      color = value > 0 ? '#0bde51' : '#de123e'
      break
  }

  return color
}
