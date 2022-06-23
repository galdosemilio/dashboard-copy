import { Component, Input, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { merge } from 'lodash'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { BehaviorSubject } from 'rxjs'
import {
  ConfigService,
  ContextService,
  MeasurementChartDataSource,
  MeasurementDatabaseV2
} from '@app/service'
import { ChartData, DateNavigatorOutput } from '@app/shared'
import { Store } from '@ngrx/store'
import { DataPointTypes } from '@coachcare/sdk'
import { AppState } from '@app/store/state'

@UntilDestroy()
@Component({
  selector: 'app-levl-chart',
  templateUrl: './levl-chart.component.html',
  host: { class: 'ccr-chart' }
})
export class LevlChartComponent implements OnInit {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }

  public chart: ChartData
  public source: MeasurementChartDataSource

  private date$ = new BehaviorSubject<DateNavigatorOutput>({})

  constructor(
    private context: ContextService,
    private config: ConfigService,
    private database: MeasurementDatabaseV2,
    private store: Store<AppState>,
    private translator: TranslateService
  ) {}

  public ngOnInit(): void {
    this.source = new MeasurementChartDataSource(
      this.database,
      this.store,
      this.context,
      this.translator
    )

    this.source.type = DataPointTypes.ACETONE

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        account: this.context.accountId,
        type: [DataPointTypes.ACETONE],
        recordedAt: {
          start: dates.startDate,
          end: dates.endDate
        }
      }
    })

    this.source
      .chart()
      .pipe(untilDestroyed(this))
      .subscribe((chart) => {
        this.chart = undefined // force refresh on change
        setTimeout(() => {
          this.chart = {}
          merge(this.chart, this.config.get('chart').factory('line'), chart)
        }, 50)
      })
  }
}
