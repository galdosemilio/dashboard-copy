import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core'
import { CcrPaginatorComponent } from '@coachcare/common/components'
import { MatSort } from '@coachcare/material'
import {
  ReportsCriteria,
  SleepDataSource,
  StatisticsDatabase
} from '@app/dashboard/reports/services'
import { ReportsState } from '@app/dashboard/reports/store'
import { criteriaSelector } from '@app/dashboard/reports/store'
import { NotifierService } from '@app/service'
import { select, Store } from '@ngrx/store'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import Papa from 'papaparse'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { CSV } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'app-statistics-sleep-table',
  templateUrl: './sleep.component.html',
  styleUrls: ['./sleep.component.scss']
})
export class SleepTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = ['name', 'date', 'hoursSlept']
  source: SleepDataSource | null

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new SleepDataSource(
      this.notifier,
      this.database,
      this.paginator,
      this.sort
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data
        ? moment(this.data.startDate).format('YYYY-MM-DD')
        : null,
      endDate: this.data
        ? moment(this.data.endDate).format('YYYY-MM-DD')
        : null,
      unit: 'day'
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
    if (!this.source.isLoaded) {
      this.refresh$.next()
      this.cdr.detectChanges()
    }
  }

  ngOnDestroy() {
    this.source.disconnect()
  }

  formatDate(date): string {
    return moment(date).format('MMM D, YYYY')
  }

  downloadCSV() {
    const criteria = this.source.args
    criteria.unit = 'day'
    criteria.limit = 'all'
    criteria.offset = 0
    void this.database.fetchSleep(criteria).then((res) => {
      const dates = res.data.map((d) => d.date)
      const orgName = res.data[0].organization.name
      const filename = `${orgName}_Sleep_Report_${dates[0]}_${
        dates[dates.length - 1]
      }.csv`
      let csv = 'SLEEP REPORT\r\n'

      const data = res.data.map((d) => ({
        ID: d.account.id,
        'First Name': d.account.firstName,
        'Last Name': d.account.lastName,
        Date: d.date,
        Hours: d.hoursSlept.sum
      }))

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
    })
  }
}
