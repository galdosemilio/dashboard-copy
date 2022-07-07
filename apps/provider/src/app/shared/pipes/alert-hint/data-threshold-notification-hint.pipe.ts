import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import { _ } from '@app/shared/utils'
import { selectDataTypes } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import {
  AlertNotificationPayload,
  AlertsDataPointThresholdPayload,
  convertToReadableFormat,
  convertUnitToPreferenceFormat
} from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, iif, Observable } from 'rxjs'
import { concatMap, filter, first, map, startWith } from 'rxjs/operators'

@Pipe({ name: 'dataThresholdNotifHint' })
export class DataThresholdNotificationHintPipe implements PipeTransform {
  constructor(
    private context: ContextService,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {}

  public transform(value: AlertNotificationPayload): Observable<string> {
    const payload = value as AlertsDataPointThresholdPayload
    const measPref = this.context.user.measurementPreference

    const thresholdValue = payload.options.threshold.value

    const dataPointValue = payload.dataPoint.value

    const dataType$ = this.store.select(selectDataTypes).pipe(
      filter((dataPointTypes) => dataPointTypes.length > 0),
      map(
        (dataPointTypes) =>
          dataPointTypes.find(
            (assoc) => assoc.type.id === payload.dataPoint.type.id.toString()
          ).type
      ),
      first()
    )

    const directionPrefix$ = this.translate.onLangChange.pipe(
      startWith(null),
      concatMap(() =>
        iif(
          () => payload.options.threshold.direction === 'above',
          this.translate.get(_('ALERTS.ABOVE')),
          this.translate.get(_('ALERTS.BELOW'))
        )
      )
    )

    return combineLatest([dataType$, directionPrefix$]).pipe(
      map(([dataType, directionPrefix]) => ({ dataType, directionPrefix })),
      concatMap(({ dataType, directionPrefix }) => {
        const readableValue = convertToReadableFormat(
          dataPointValue,
          dataType,
          measPref
        )
        const readableThreshold = convertToReadableFormat(
          thresholdValue,
          dataType,
          measPref
        )
        const diff = Math.abs(readableValue - readableThreshold)
        const unit = convertUnitToPreferenceFormat(dataType, measPref)

        return this.translate.get('ALERTS.DATA_THRESHOLD_NOTIFICATION_HINT', {
          diff: Math.round(diff),
          directionPrefix: directionPrefix.toLowerCase(),
          unit: unit ?? '', // some data types don't have unit
          limit: Math.round(readableThreshold),
          value: Math.round(readableValue)
        })
      })
    )
  }
}
