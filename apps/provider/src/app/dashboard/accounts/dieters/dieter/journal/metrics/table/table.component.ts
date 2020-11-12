import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core'
import {
  MeasurementTimeframe,
  MetricsDataSource,
  MetricsRow
} from '@app/dashboard/accounts/dieters/services'
import { DateNavigatorOutput, sleep } from '@app/shared'
import * as moment from 'moment'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-dieter-journal-metrics-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class MetricsTableComponent implements OnDestroy, OnInit {
  @Input() initialDates: DateNavigatorOutput
  @Input() source: MetricsDataSource
  @Input() timeframe: MeasurementTimeframe

  @Output()
  dateChange: EventEmitter<DateNavigatorOutput> = new EventEmitter<
    DateNavigatorOutput
  >()

  public columns: string[] = ['date', 'red_foods', 'aerobic', 'strength']
  // dates navigator store
  public dates: DateNavigatorOutput = {}
  public rows: MetricsRow[] = []

  private refresh$ = new Subject<any>()

  public ngOnDestroy() {
    this.source.unregister('chart')
  }

  public ngOnInit() {
    if (this.initialDates) {
      this.dates = this.initialDates
    }

    this.source.register('chart', false, this.refresh$, () => ({
      timeframe: this.dates.timeframe as MeasurementTimeframe,
      startDate: moment(this.dates.startDate).format('YYYY-MM-DD'),
      endDate: moment(this.dates.endDate).format('YYYY-MM-DD')
    }))

    this.source
      .connect()
      .pipe(untilDestroyed(this))
      .subscribe((rows) => (this.rows = rows))
  }

  public async updateDates(dates: DateNavigatorOutput): Promise<void> {
    await sleep(100)
    this.dates = dates
    this.dateChange.emit(this.dates)
    this.refresh$.next(true)
  }
}
