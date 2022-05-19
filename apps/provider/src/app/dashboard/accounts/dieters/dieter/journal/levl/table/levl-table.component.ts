import { Component, Input, OnInit } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import {
  ContextService,
  MeasurementAggregatesDatabase,
  MeasurementAggregatesDataSource
} from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { DataPointTypes, MeasurementSource } from '@coachcare/sdk'
import * as moment from 'moment'

@Component({
  selector: 'app-levl-table',
  templateUrl: './levl-table.component.html'
})
export class LevlTableComponent implements OnInit {
  @Input() columns = ['date', 'acetonePpm']
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }

  public source: MeasurementAggregatesDataSource

  private date$ = new BehaviorSubject<DateNavigatorOutput>({})

  constructor(
    private context: ContextService,
    private database: MeasurementAggregatesDatabase
  ) {}

  public ngOnInit(): void {
    this.source = new MeasurementAggregatesDataSource(this.database)

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        account: this.context.accountId,
        type: [DataPointTypes.ACETONE],
        recordedAt: {
          start: moment(dates.startDate).startOf('day').toISOString(),
          end: moment(dates.endDate).endOf('day').toISOString()
        },
        source: [MeasurementSource.LEVL],
        unit: 'day'
      }
    })
  }
}
