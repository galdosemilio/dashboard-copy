import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PainDatabase, PainDataSource } from '@app/dashboard/accounts/dieters/services';
import { ContextService, NotifierService } from '@app/service';
import { CcrPaginator, DateNavigatorOutput } from '@app/shared';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dieter-journal-pain',
  templateUrl: 'pain.component.html',
  styleUrls: ['pain.component.scss']
})
export class PainComponent implements OnInit {
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates);
  }

  @ViewChild('paginator', { static: false })
  paginator: CcrPaginator;

  date$ = new BehaviorSubject<DateNavigatorOutput>({});
  source: PainDataSource | null;

  constructor(
    private context: ContextService,
    private database: PainDatabase,
    private notifier: NotifierService
  ) {}

  ngOnInit() {
    this.source = new PainDataSource(this.notifier, this.database, this.paginator);
    this.source.addDefault({
      account: this.context.accountId
    });
    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue();
      return {
        startDate: moment(dates.startDate).format(),
        endDate: moment(dates.endDate).format()
      };
    });
  }
}
