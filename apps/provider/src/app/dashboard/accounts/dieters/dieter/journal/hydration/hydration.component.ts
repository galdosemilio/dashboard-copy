import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import {
  HydrationDatabase,
  HydrationDataSource
} from '@app/dashboard/accounts/dieters/services';
import { ContextService, NotifierService } from '@app/service';
import { DateNavigatorOutput } from '@app/shared';

@Component({
  selector: 'app-dieter-journal-hydration',
  templateUrl: 'hydration.component.html',
  styleUrls: ['hydration.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HydrationComponent implements OnInit, OnDestroy {
  @Input() dailyHydrationGoal: number;
  @Input()
  set dates(dates: DateNavigatorOutput) {
    this.date$.next(dates);
  }

  source: HydrationDataSource | null;
  date$ = new BehaviorSubject<DateNavigatorOutput>({});

  constructor(
    private context: ContextService,
    private notifier: NotifierService,
    private database: HydrationDatabase
  ) {}

  ngOnInit(): void {
    this.source = new HydrationDataSource(
      this.notifier,
      this.database,
      this.dailyHydrationGoal
    );
    this.source.addDefault({
      account: this.context.accountId,
      unit: 'day'
    });

    this.source.addRequired(this.date$, () => {
      const dates = this.date$.getValue();
      return {
        startDate: dates.startDate,
        endDate: dates.endDate
      };
    });
  }

  ngOnDestroy() {
    this.source.disconnect();
  }
}
