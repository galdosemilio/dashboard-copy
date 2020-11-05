import { AccountMeasurementPreferenceType } from '@coachcare/npm-api'

import { _ } from '../i18n.utils'
import { Metric } from './conversion.types'
import { unitConversion } from './unit.conversion'

export function unitLabel(
  pref: AccountMeasurementPreferenceType,
  metric: Metric,
  value: number
) {
  const plural = unitConversion(pref, metric, value, false)

  switch (metric) {
    // composition
    case 'composition':
      switch (pref) {
        case 'metric':
          return _('UNIT.KG')
        case 'uk':
        case 'us':
          return plural !== 1 ? _('UNIT.LBS') : _('UNIT.LB')
      }
      break
    // circumference
    case 'circumference':
      switch (pref) {
        case 'metric':
          return _('UNIT.CM')
        case 'uk':
        case 'us':
          return _('UNIT.IN')
      }
      break
    // distance
    case 'distance':
      switch (pref) {
        case 'metric':
        case 'uk':
          return _('UNIT.KM')
        case 'us':
          return _('UNIT.MI')
      }
      break
    // height
    case 'height':
      switch (pref) {
        case 'metric':
          return _('UNIT.CM')
        case 'uk':
        case 'us':
          return _('UNIT.FEET')
      }
      break
    // speed
    case 'speed':
      switch (pref) {
        case 'metric':
        case 'uk':
          return _('UNIT.KMH')
        case 'us':
          return _('UNIT.MPH')
      }
      break
    // volume
    case 'volume':
      switch (pref) {
        case 'metric':
        case 'uk':
          return _('UNIT.LT')
        case 'us':
          return _('UNIT.OZ')
      }
      break
    // unknown
    default:
      console.error(`unitLabel: unrecognized metric ${metric}`)
  }
  return ''
}
