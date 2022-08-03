import { Pipe, PipeTransform } from '@angular/core'
import { _ } from '@app/shared/utils'
import { selectDataTypes } from '@app/store/measurement-label'
import { AppState } from '@app/store/state'
import {
  AlertPreference,
  AlertsDataPointThresholdOptions
} from '@coachcare/sdk'
import { Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { combineLatest, Observable } from 'rxjs'
import { concatMap, map, startWith, take } from 'rxjs/operators'

@Pipe({ name: 'dataPointMissingAlertHint' })
export class DataPointMissingAlertHint implements PipeTransform {
  constructor(
    private store: Store<AppState>,
    private translate: TranslateService
  ) {}

  public transform(value: AlertPreference): Observable<string> {
    const alertOptions = value.organization.preference
      .options as AlertsDataPointThresholdOptions

    const [periodAmount] = alertOptions.analysis.period.split(' ')

    const onLangChange$ = this.translate.onLangChange.pipe(startWith(null))

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
      concatMap(() =>
        this.translate.get(
          +periodAmount === 1 ? _('GLOBAL.DAY') : _('UNIT.DAYS')
        )
      ),
      map((periodSuffix) => `${periodAmount} ${periodSuffix}`.toLowerCase())
    )

    return combineLatest([dataType$, readablePeriod$]).pipe(
      map(([dataType, readablePeriod]) => ({
        dataType,
        readablePeriod
      })),
      concatMap(({ dataType, readablePeriod }) =>
        this.translate.get(_('ALERTS.DATA_POINT_MISSING_ALERT_HINT'), {
          period: readablePeriod,
          type: dataType?.name.toLowerCase() ?? ''
        })
      )
    )
  }
}
