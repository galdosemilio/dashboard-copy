import { Pipe, PipeTransform } from '@angular/core'
import { _ } from '@app/shared/utils'
import {
  AlertNotificationPayload,
  AlertsDataPointMissingPayload
} from '@coachcare/sdk'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { concatMap, map, startWith } from 'rxjs/operators'

@Pipe({ name: 'dataPointMissingNotifHint' })
export class DataPointMissingNotificationHintPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  public transform(value: AlertNotificationPayload): Observable<string> {
    const payload = value as AlertsDataPointMissingPayload
    const [periodAmount] = payload.options.analysis.period.split(' ')

    const onLangChange$ = this.translate.onLangChange.pipe(startWith(null))

    const readablePeriod$ = onLangChange$.pipe(
      concatMap(() =>
        this.translate.get(
          +periodAmount === 1 ? _('GLOBAL.DAY') : _('UNIT.DAYS')
        )
      ),
      map((periodSuffix) => `${periodAmount} ${periodSuffix}`.toLowerCase())
    )

    return readablePeriod$.pipe(
      concatMap((readablePeriod) =>
        this.translate.get(_('ALERTS.DATA_POINT_MISSING_NOTIFICATION_HINT'), {
          period: readablePeriod
        })
      )
    )
  }
}
