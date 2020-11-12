import { Component, Input, OnInit, ViewChild } from '@angular/core'
import {
  ExerciseDatabase,
  ExerciseDataSource
} from '@app/dashboard/accounts/dieters/services'
import { ContextService, NotifierService } from '@app/service'
import { CcrPaginator, DateNavigatorOutput } from '@app/shared'
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs'

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
  @ViewChild('paginator', { static: false })
  paginator: CcrPaginator

  date$ = new BehaviorSubject<DateNavigatorOutput>({})
  source: ExerciseDataSource | null

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
  }
}
