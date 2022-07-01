import { Pipe, PipeTransform } from '@angular/core'
import { ContextService } from '@app/service'
import { ALERT_REFRESH_TIME_PERIODS } from '@app/shared/model'
import { _ } from '@app/shared/utils'
import { selectDataTypes } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import {
  AlertPreference,
  AlertsDataPointThresholdOptions,
  convertUnitToPreferenceFormat
} from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, iif, Observable } from 'rxjs'
import { concatMap, map, startWith, take } from 'rxjs/operators'

@Pipe({ name: 'dataThresholdAlertHint' })
export class DataThresholdAlertHintPipe implements PipeTransform {
  constructor(
    private context: ContextService,
    private store: Store<AppState>,
    private translate: TranslateService
  ) {}

  public transform(value: AlertPreference): Observable<string> {
    const alertOptions = value.organization.preference
      .options as AlertsDataPointThresholdOptions

    const periodString =
      ALERT_REFRESH_TIME_PERIODS.find(
        (period) => period.value === alertOptions.analysis.period
      )?.viewValue ?? alertOptions.analysis.period

    const onLangChange$ = this.translate.onLangChange.pipe(startWith(null))

    const directionPrefix$ = onLangChange$.pipe(
      concatMap(() =>
        iif(
          () => alertOptions.direction === 'above',
          this.translate.get(_('ALERTS.EXCEEDS')),
          this.translate.get(_('ALERTS.IS_BELOW'))
        )
      )
    )

    const dataType$ = this.store.select(selectDataTypes).pipe(
      map(
        (assocs) =>
          assocs.find(
            (assoc) => assoc.type.id === alertOptions.dataPoint.type.id
          ).type
      ),
      take(1)
    )

    const readablePeriod$ = onLangChange$.pipe(
      concatMap(() => this.translate.get(_(periodString)))
    )

    return combineLatest([dataType$, directionPrefix$, readablePeriod$]).pipe(
      map(([dataType, directionPrefix, readablePeriod]) => ({
        dataType,
        directionPrefix,
        readablePeriod
      })),
      concatMap(({ dataType, directionPrefix, readablePeriod }) => {
        const readableUnit = convertUnitToPreferenceFormat(
          dataType,
          this.context.user.measurementPreference
        )

        return this.translate.get(_('ALERTS.DATA_THRESHOLD_ALERT_HINT'), {
          period: readablePeriod,
          type: dataType.name,
          unit: readableUnit ?? '', // some data types don't have a unit so we show it blank
          directionPrefix: directionPrefix.toLowerCase(),
          value: Math.round(alertOptions.dataPoint.value)
        })
      })
    )
  }
}
