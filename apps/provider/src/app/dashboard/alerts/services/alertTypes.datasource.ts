import { Injectable } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import { _, uxAproximateGrams, uxPoundsToGrams } from '@app/shared/utils'
import { selectDataTypes } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import {
  AlertPreferenceResponse,
  AlertsDataPointThresholdOptions,
  AlertTypeId,
  AlertTypesResponse,
  FetchAlertPreferenceRequest,
  MeasurementDataPointTypeAssociation,
  NamedEntity
} from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { filter, fromPairs } from 'lodash'
import * as moment from 'moment'
import { from, Observable } from 'rxjs'
import { take } from 'rxjs/operators'
import { AlertsDatabase } from './alerts.database'

export interface AlertTypesPreference {
  typeCode: string
  typeId: AlertTypeId
  icon: string
  option: string
  value: any
  isActive: boolean
  isInherited?: boolean
  texts?: { [field: string]: string }
  overrideVisibility?: boolean
  isVisible?: boolean
  hideCheckbox?: boolean
  optionExt?: string
}

@Injectable()
export class AlertTypesDataSource extends TableDataSource<
  AlertTypesPreference,
  [
    AlertPreferenceResponse,
    AlertTypesResponse,
    MeasurementDataPointTypeAssociation[]
  ],
  FetchAlertPreferenceRequest
> {
  hasInheritedAlert = false
  prefIds: { [code: string]: string }

  constructor(
    protected notify: NotifierService,
    protected database: AlertsDatabase,
    protected context: ContextService,
    protected store: Store<AppState>
  ) {
    super()
  }

  disconnect() {}

  defaultFetch(): [
    AlertPreferenceResponse,
    AlertTypesResponse,
    MeasurementDataPointTypeAssociation[]
  ] {
    return [{ data: [], pagination: {} }, { data: [], pagination: {} }, []]
  }

  fetch(
    criteria: FetchAlertPreferenceRequest
  ): Observable<
    [
      AlertPreferenceResponse,
      AlertTypesResponse,
      MeasurementDataPointTypeAssociation[]
    ]
  > {
    return from(
      Promise.all([
        this.database.fetchAlertPreference(criteria),
        this.database.fetchAlertTypes(),
        this.store.select(selectDataTypes).pipe(take(1)).toPromise()
      ])
    )
  }

  mapResult(
    result: [
      AlertPreferenceResponse,
      AlertTypesResponse,
      MeasurementDataPointTypeAssociation[]
    ]
  ): Array<AlertTypesPreference> {
    const [alertPreferences, alertTypes, dataTypeAssocs] = result

    this.getTotal({
      pagination: alertPreferences.pagination,
      data: result[0].data
    })

    let options: Array<AlertTypesPreference> = []
    const types = fromPairs(alertTypes.data.map((v) => [v.code, v.id]))
    const dataTypes = dataTypeAssocs.map((assoc) => assoc.type)

    const unit = this.context.user.measurementPreference

    // hardcoded existing options to list the inactive too
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
    alertPreferences.data.map((v) => {
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

    /**
     * Data Point Threshold and Data Point Missing Alerts
     */
    const dataPointAlerts = alertPreferences.data.filter(
      (preference) =>
        preference.type.id === AlertTypeId.DATA_POINT_THRESHOLD ||
        preference.type.id === AlertTypeId.DATA_POINT_MISSING
    )

    options = [
      ...options,
      ...dataPointAlerts
        .map((alert) => {
          const prefDataType = (
            alert.organization.preference
              .options as AlertsDataPointThresholdOptions
          ).dataPoint.type

          ;(
            alert.organization.preference
              .options as AlertsDataPointThresholdOptions
          ).dataPoint.type =
            dataTypes.find((type) => type.id === prefDataType.id) ??
            prefDataType

          return {
            icon:
              alert.type.id === AlertTypeId.DATA_POINT_THRESHOLD
                ? 'circle_notifications'
                : 'missing-data',
            isActive: alert.organization.preference.isActive,
            isInherited: alert.organization.id !== this.context.organizationId,
            option: '',
            texts: {
              title:
                alert.type.id === AlertTypeId.DATA_POINT_THRESHOLD
                  ? _('ALERTS.TYPES.DATA_THRESHOLD_ALERT')
                  : _('ALERTS.TYPES.MISSING_DATA_ALERT'),
              description:
                alert.type.id === AlertTypeId.DATA_POINT_THRESHOLD
                  ? _('ALERTS.TYPES.DATA_THRESHOLD_ALERT_DESCRIPTION')
                  : _('ALERTS.TYPES.MISSING_DATA_ALERT_DESCRIPTION')
            },
            typeCode: alert.type.code,
            typeId: alert.type.id,
            value: alert
          }
        })
        .sort((prevAlert, currAlert) => {
          const prevTypeName = (
            (
              prevAlert.value.organization.preference
                .options as AlertsDataPointThresholdOptions
            ).dataPoint.type as NamedEntity
          ).name
          const currTypeName = (
            (
              currAlert.value.organization.preference
                .options as AlertsDataPointThresholdOptions
            ).dataPoint.type as NamedEntity
          ).name

          if (prevTypeName < currTypeName) {
            return -1
          } else if (prevTypeName > currTypeName) {
            return 1
          }

          return 0
        })
    ]

    this.hasInheritedAlert = options.some((opt) => opt.isInherited)

    return options
  }

  private getTranslationString(typeCode, option, suffix = '') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
