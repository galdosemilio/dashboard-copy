import { AccountMeasurementPreferenceType } from '@coachcare/npm-api'

import { INCHES, Metric, MILES, OUNCES, POUND } from './conversion.types'

export function unitConversion(
  pref: AccountMeasurementPreferenceType,
  metric: Metric,
  value: number,
  toFixed: number | boolean = 1
) {
  let res

  switch (metric) {
    // composition
    case 'composition':
      // value: grams
      switch (pref) {
        case 'metric':
          // to Kg
          res = value / 1000
          break
        case 'uk':
        case 'us':
        default:
          // to Pounds
          res = value / POUND
          break
      }
      break
    // circumference
    case 'circumference':
      // value: milimeters
      switch (pref) {
        case 'metric':
          // to Centimeters
          res = value / 10
          break
        case 'uk':
        case 'us':
        default:
          // to Inches
          res = value * INCHES
          break
      }
      break
    // distance
    case 'distance':
      // value: meters
      switch (pref) {
        case 'metric':
        case 'uk':
          // to Km
          res = value / 1000
          break
        case 'us':
        default:
          // to Miles
          res = value * MILES
          break
      }
      break
    // height
    case 'height':
      res = value
      break
    // speed
    case 'speed':
      res = value
      break
    // volume
    case 'volume':
      // value: mililiters
      switch (pref) {
        case 'metric':
        case 'uk':
          // to Liters
          res = value * 0.001
          break
        case 'us':
        default:
          // to Ounces
          res = value * OUNCES
          break
      }
      break
    case 'temperature-push':
      switch (pref) {
        case 'us':
          res = (value - 32) * (5 / 9)
          break
        case 'metric':
        case 'uk':
        default:
          res = +value
          break
      }
      break
    case 'temperature-fetch':
      switch (pref) {
        case 'us':
          res = value * (9 / 5) + 32
          break
        case 'metric':
        case 'uk':
        default:
          res = +value
          break
      }
      break
    // unknown
    default:
      console.error(`unitConversion: unrecognized metric ${metric}`)
      res = value
  }

  if (toFixed === false) {
    // return number
    return res
  } else if (toFixed === true) {
    // fancy formatting
    return res.toFixed(1).replace('.0', '')
  }
  // return specific decimals
  return res.toFixed(toFixed)
}
