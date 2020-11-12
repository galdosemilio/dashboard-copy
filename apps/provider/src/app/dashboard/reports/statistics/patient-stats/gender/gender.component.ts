import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import { untilDestroyed } from 'ngx-take-until-destroy'
import { Subject } from 'rxjs'

import {
  GenderDataSource,
  ReportsCriteria,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { NotifierService } from '@app/service'

@Component({
  selector: 'app-statistics-patient-stats-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit, AfterViewInit, OnDestroy {
  source: GenderDataSource | null

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new GenderDataSource(
      this.notifier,
      this.database,
      this.translator
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      date: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null
    }))

    this.store
      .pipe(untilDestroyed(this), select(criteriaSelector))
      .subscribe((reportsCriteria: ReportsCriteria) => {
        if (!isEmpty(reportsCriteria)) {
          this.data = reportsCriteria
          this.refresh$.next()
        }
      })
  }

  ngAfterViewInit() {
    if (!this.source.isLoaded && this.data) {
      this.refresh$.next()
      this.cdr.detectChanges()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }
}
