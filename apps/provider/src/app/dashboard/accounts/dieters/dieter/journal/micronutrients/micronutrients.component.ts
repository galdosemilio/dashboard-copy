import { Component, Input, OnInit } from '@angular/core'
import { ContextService, NotifierService } from '@app/service'
import { DateNavigatorOutput } from '@app/shared'
import { BehaviorSubject } from 'rxjs'
import { FoodDatabase, FoodDataSource, FoodDayAmount } from '../../../services'
import * as moment from 'moment'

@Component({
  selector: 'app-dieter-journal-micronutrients',
  templateUrl: './micronutrients.component.html',
  styleUrls: ['./micronutrients.component.scss']
})
export class MicronutrientsComponent implements OnInit {
  @Input() set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates)
  }

  public date$ = new BehaviorSubject<DateNavigatorOutput>({})
  public rows: FoodDayAmount[] = []
  public source: FoodDataSource

  constructor(
    private context: ContextService,
    private database: FoodDatabase,
    private notifier: NotifierService
  ) {}

  public ngOnInit(): void {
    this.source = new FoodDataSource(this.notifier, this.database)

    this.source.addDefault({
      account: +this.context.accountId,
      noLimit: true
    })

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue()
      return {
        startDate: moment(dates.startDate).toISOString(),
        endDate: moment(dates.endDate).endOf('day').toISOString()
      }
    })

    this.source.connect().subscribe((values) => (this.rows = values))
  }

  public toggleRow(row: FoodDayAmount): void {
    const consumedDate = row.consumedDate
    const startIndex = this.rows.findIndex(
      (e) => e.consumedDate && e.consumedDate >= consumedDate
    )
    let endIndex = this.rows.findIndex(
      (e) => e.consumedDate && e.consumedDate > consumedDate
    )

    endIndex = endIndex === -1 ? this.rows.length : endIndex

    row.isExpanded = !row.isExpanded

    this.rows.forEach((t, index) => {
      if (index < startIndex || index > endIndex) return

      if (t.level === 1 && row.isExpanded) {
        t.isExpanded = false
        t.isHidden = false
      } else if (t.level === 1) {
        t.isExpanded = false
        t.isHidden = true
      }
    })
  }
}
