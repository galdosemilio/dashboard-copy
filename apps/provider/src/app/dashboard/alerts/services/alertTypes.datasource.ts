import { Injectable } from '@angular/core'
import { resolveConfig } from '@app/config/section'
import { ContextService, NotifierService } from '@app/service'
import {
  _,
  TableDataSource,
  uxAproximateGrams,
  uxPoundsToGrams
} from '@app/shared'
import {
  AlertPreferenceResponse,
  AlertTypesResponse,
  FetchAlertPreferenceRequest
} from '@coachcare/npm-api'
import { filter, fromPairs } from 'lodash'
import * as moment from 'moment'
import { from, Observable } from 'rxjs'
import { AlertsDatabase } from './alerts.database'

export interface AlertTypesPreference {
  typeCode: string
  typeId: number
  icon: string
  option: string
  value: any
  isActive: boolean
  texts?: { [field: string]: string }
  overrideVisibility?: boolean
  isVisible?: boolean
  hideCheckbox?: boolean
  optionExt?: string
}

@Injectable()
export class AlertTypesDataSource extends TableDataSource<
  AlertTypesPreference,
  [AlertPreferenceResponse, AlertTypesResponse],
  FetchAlertPreferenceRequest
> {
  prefIds: { [code: string]: string }

  constructor(
    protected notify: NotifierService,
    protected database: AlertsDatabase,
    protected context: ContextService
  ) {
    super()
  }

  disconnect() {}

  defaultFetch(): [AlertPreferenceResponse, AlertTypesResponse] {
    return [
      { data: [], pagination: {} },
      { data: [], pagination: {} }
    ]
  }

  fetch(
    criteria: FetchAlertPreferenceRequest
  ): Observable<[AlertPreferenceResponse, AlertTypesResponse]> {
    return from(
      Promise.all([
        this.database.fetchAlertPreference(criteria),
        this.database.fetchAlertTypes()
      ])
    )
  }

  mapResult(
    result: [AlertPreferenceResponse, AlertTypesResponse]
  ): Array<AlertTypesPreference> {
    this.total = result[0].pagination.next
      ? result[0].pagination.next + 1
      : this.criteria.offset + result[0].data.length

    let options: Array<AlertTypesPreference> = []
    const types = fromPairs(result[1].data.map((v) => [v.code, v.id]))

    const unit = this.context.user.measurementPreference

    // hardcoded existing options to list the unactive too
    options.push({
      typeCode: 'weight-regained',
      typeId: types['weight-regained'],
      icon: 'trending-up',
      option: 'threshold',
      value: uxPoundsToGrams(unit, 10),
      isActive: false
    })
    options.push({
      typeCode: 'inactivity',
      typeId: types['inactivity'],
      icon: 'food',
      option: 'meal-logging',
      value: { period: '8 days' },
      isActive: false
    })
    options.push({
      typeCode: 'inactivity',
      typeId: types['inactivity'],
      icon: 'scale',
      option: 'weight-logging',
      value: { period: '5 days' },
      isActive: false
    })
    options.push({
      typeCode: 'inactivity',
      typeId: types['inactivity'],
      icon: 'tracker',
      option: 'tracker-syncing',
      value: { period: '3 days' },
      isActive: false
    })

    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      option: 'header',
      icon: 'weight-thresh',
      value: undefined,
      isActive: true,
      isVisible: true,
      overrideVisibility: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'threshold',
      optionExt: '_gain',
      value: { gain: uxPoundsToGrams(unit, 10) },
      isActive: true,
      hideCheckbox: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'threshold',
      optionExt: '_loss',
      value: { loss: uxPoundsToGrams(unit, 10) },
      isActive: true,
      hideCheckbox: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'daySpan',
      value: 1,
      isActive: true,
      hideCheckbox: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'requireDailyMeasurement',
      value: false,
      isActive: true,
      hideCheckbox: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'triggerPeriod',
      value: 'daily',
      isActive: true,
      hideCheckbox: true
    })
    options.push({
      typeCode: 'weight-threshold',
      typeId: types['weight-threshold'],
      icon: 'weight-thresh',
      option: 'startDate',
      value: moment().toISOString(),
      isActive: true,
      isVisible: false,
      hideCheckbox: true,
      overrideVisibility: false
    })

    this.prefIds = {}
    result[0].data.map((v) => {
      // update id
      if (v.organization.id === this.criteria.organization) {
        this.prefIds[v.type.code] = v.id.toString()
      }
      // loop saved preferences and update the values
      const pref = v.organization.preference

      if (v.type.code === 'weight-threshold') {
        options.forEach((opt) => {
          if (opt.typeCode === v.type.code) {
            opt.isActive = pref.isActive
            opt.isVisible =
              opt.overrideVisibility !== undefined
                ? opt.overrideVisibility
                : pref.isActive
          }
        })
      }

      Object.keys(pref.options).forEach((opt) => {
        const opts = filter(options, { typeCode: v.type.code, option: opt })
        opts.forEach((option) => {
          if (option) {
            option.isActive = pref.isActive
            const value = pref.options[opt]
            // custom conversion for weight-regained
            option.value =
              v.type.code === 'weight-regained' && opt === 'threshold'
                ? uxAproximateGrams(unit, value)
                : v.type.code === 'weight-threshold' && opt === 'threshold'
                ? {
                    gain: uxAproximateGrams(unit, value.gain || 0),
                    loss: uxAproximateGrams(unit, value.loss || 0)
                  }
                : v.type.code === 'weight-threshold' && opt === 'startDate'
                ? moment()
                    .subtract(1, 'day')
                    .startOf('day')
                    .format('YYYY-MM-DD')
                : value
          }
        })
      })
    })

    options = options.map((p) => {
      // set the translations
      p.texts = {
        title: this.getTranslationString(
          p.typeCode,
          `${p.option}${p.optionExt || ''}`
        ),
        description: this.getTranslationString(
          p.typeCode,
          `${p.option}${p.optionExt || ''}`,
          '-description'
        )
      }
      return p
    })

    return options
  }

  private getTranslationString(typeCode, option, suffix = '') {
    const existing = [
      _('ALERTS.TYPES.WEIGHT_REGAINED_THRESHOLD'),
      _('ALERTS.TYPES.WEIGHT_REGAINED_THRESHOLD_DESCRIPTION'),
      _('ALERTS.TYPES.INACTIVITY_MEAL_LOGGING'),
      _('ALERTS.TYPES.INACTIVITY_MEAL_LOGGING_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_DAYSPAN'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_DAYSPAN_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_REQUIREDAILYMEASUREMENT'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_REQUIREDAILYMEASUREMENT_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_HEADER'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_HEADER_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_THRESHOLD_GAIN'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_THRESHOLD_GAIN_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_THRESHOLD_LOSS'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_THRESHOLD_LOSS_DESCRIPTION'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_TRIGGERPERIOD'),
      _('ALERTS.TYPES.WEIGHT_THRESHOLD_TRIGGERPERIOD_DESCRIPTION'),
      _('ALERTS.TYPES.INACTIVITY_WEIGHT_LOGGING'),
      _('ALERTS.TYPES.INACTIVITY_WEIGHT_LOGGING_DESCRIPTION'),
      _('ALERTS.TYPES.INACTIVITY_TRACKER_SYNCING'),
      _('ALERTS.TYPES.INACTIVITY_TRACKER_SYNCING_DESCRIPTION')
    ]
    const str = `ALERTS.TYPES.${typeCode}-${option}${suffix}`
    return str.replace(/-/g, '_').toUpperCase()
  }
}
