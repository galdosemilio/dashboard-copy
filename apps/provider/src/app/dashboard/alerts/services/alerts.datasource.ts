import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import * as moment from 'moment'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Observable } from 'rxjs'

import { ContextService, NotifierService } from '@app/service'
import { TableDataSource } from '@app/shared/model'
import {
  _,
  TranslationsObject,
  unitConversion,
  unitLabel
} from '@app/shared/utils'
import { AlertNotificationResponse, NotificationRequest } from '@coachcare/sdk'
import { AlertNotification } from '../models'
import { AlertsDatabase } from './alerts.database'

@UntilDestroy()
@Injectable()
export class AlertsDataSource extends TableDataSource<
  AlertNotification,
  AlertNotificationResponse,
  NotificationRequest
> {
  i18n: TranslationsObject

  constructor(
    protected notify: NotifierService,
    protected database: AlertsDatabase,
    protected context: ContextService,
    protected translator: TranslateService
  ) {
    super()

    this.translate()
    this.translator.onLangChange
      .pipe(untilDestroyed(this, 'disconnect'))
      .subscribe(() => this.translate)
  }

  translate() {
    this.translator
      .get([_('UNIT.KG'), _('UNIT.LB'), _('UNIT.LBS')])
      .subscribe((translations) => (this.i18n = translations))
  }

  disconnect() {}

  defaultFetch(): AlertNotificationResponse {
    return { data: [], pagination: {} }
  }

  fetch(criteria: NotificationRequest): Observable<AlertNotificationResponse> {
    return this.database.fetchNotifications(criteria)
  }

  mapResult(result: AlertNotificationResponse): any {
    this.total = result.pagination.next
      ? result.pagination.next + 1
      : this.criteria.offset + result.data.length

    const now = moment()
    return result.data
      .map((value) => {
        const alert = {
          detail: '',
          icon: '',
          params: {}
        }
        let since: moment.Moment
        const units = this.context.user.measurementPreference
        const val = value.payload?.value

        switch (value.type.id) {
          // 1. Weight Regained
          case '1':
            alert.params['value'] = unitConversion(units, 'composition', val)
            alert.params['unit'] =
              this.i18n[unitLabel(units, 'composition', val)]
            alert.detail = _('ALERTS.WEIGHT_REGAINED')
            alert.icon = 'trending-up'
            break

          // 2. Meal logging
          case '2':
            since =
              value.payload && value.payload.lastMeasurement
                ? moment(value.payload.lastMeasurement)
                : undefined
            alert.params['date'] =
              since !== undefined ? since.to(now) : undefined
            alert.detail =
              alert.params['date'] !== undefined
                ? _('ALERTS.MEAL_LOGGING')
                : _('ALERTS.MEAL_LOGGING_NO_SINCE')
            alert.icon = 'food'
            break

          // 3. Tracker Syncing
          case '3':
            alert.detail = _('ALERTS.TRACKER_SYNCING')
            alert.icon = 'tracker'
            break

          // 4. Weight Logging
          case '4':
            alert.detail = _('ALERTS.WEIGHT_LOGGING')
            alert.icon = 'scale'
            break

          // 5. Weight Threshold
          case '5':
            if (value.payload.weight !== undefined) {
              const weight = value.payload.weight
              alert.params['value'] = unitConversion(
                units,
                'composition',
                weight.delta
              )
              alert.params['unit'] =
                this.i18n[unitLabel(units, 'composition', val)]
              alert.detail = _('ALERTS.WEIGHT_REGAINED')

              if (alert.params['value'] < 0) {
                alert.detail = _('ALERTS.WEIGHT_LOST')
                alert.params['value'] = Math.abs(alert.params['value'])
              }

              alert.icon = 'weight-thresh'
            }
            break

          default:
            return
        }

        return new AlertNotification({
          ...value,
          ...alert
        })
      })
      .filter((e) => e)
  }
}
