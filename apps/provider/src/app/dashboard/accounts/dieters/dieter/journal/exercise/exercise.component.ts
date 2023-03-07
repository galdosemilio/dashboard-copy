import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { resolveConfig } from '@app/config/section'
import {
  ExerciseDatabase,
  ExerciseDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { chain } from 'lodash'
import * as moment from 'moment'
import { BehaviorSubject, debounceTime, merge } from 'rxjs'

@UntilDestroy()
@Component({
  selector: 'app-dieter-journal-exercise',
  templateUrl: 'exercise.component.html',
  styleUrls: ['exercise.component.scss']
})
export class ExerciseComponent implements OnInit {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent

  date$ = new BehaviorSubject<DateNavigatorOutput>({})
  source: ExerciseDataSource | null
  showTotalModerate = false
  totalModerateTime = 0

  constructor(
    private context: ContextService,
    private database: ExerciseDatabase,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.source = new ExerciseDataSource(
      this.notifier,
      this.database,
      this.paginator
    )
    this.source.addDefault({
      account: this.context.accountId
    })
    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        start: moment(dates.startDate).format(),
        end: moment(dates.endDate).endOf('day').format()
      }
    })
    merge(this.context.organization$, this.context.account$, this.date$)
      .pipe(untilDestroyed(this), debounceTime(500))
      .subscribe(() => {
        const dates = this.date$.getValue()
        this.showTotalModerate =
          resolveConfig(
            'PATIENT_DASHBOARD.SHOW_EXERCISE_MODERATE_TOTAL',
            this.context.organization
          ) && dates.timeframe === 'week'

        void this.resolveTotalModerateTime(dates.startDate, dates.endDate)
      })
  }

  async resolveTotalModerateTime(startDate: string, endDate: string) {
    this.totalModerateTime = 0

    if (!this.showTotalModerate) {
      return
    }

    try {
      const res = await this.database
        .fetchAll({
          account: this.context.accountId,
          start: moment(startDate).format(),
          end: moment(endDate).endOf('day').format(),
          limit: 'all'
        })
        .toPromise()

      this.totalModerateTime = chain(res.data)
        .filter((entry) => entry.intensity >= 5 && entry.intensity < 7)
        .reduce(
          (total, entry) =>
            total +
            moment(entry.activitySpan.end).diff(
              moment(entry.activitySpan.start),
              'minute'
            ),
          0
        )
        .valueOf()
    } catch (err) {
      this.notifier.error(err)
    }
  }
}
