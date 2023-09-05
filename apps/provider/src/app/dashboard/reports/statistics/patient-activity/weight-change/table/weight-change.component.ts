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
  StatisticsDatabase,
  WeightChangeDataSource
} from '@app/dashboard/reports/services'
import { criteriaSelector, ReportsState } from '@app/dashboard/reports/store'
import { ContextService, NotifierService } from '@app/service'
import { _, unitConversion, unitLabel } from '@app/shared'
import { select, Store } from '@ngrx/store'
import { TranslateService } from '@ngx-translate/core'
import { isEmpty } from 'lodash'
import * as moment from 'moment-timezone'
import Papa from 'papaparse'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'
import { Subject } from 'rxjs'
import { CSV } from '@coachcare/common/shared'

@UntilDestroy()
@Component({
  selector: 'app-statistics-weight-change-table',
  templateUrl: './weight-change.component.html',
  styleUrls: ['./weight-change.component.scss']
})
export class WeightChangeTableComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(CcrPaginatorComponent, { static: true })
  paginator: CcrPaginatorComponent
  @ViewChild(MatSort, { static: true })
  sort: MatSort

  columns = ['name', 'startWeight', 'endWeight', 'change', 'value']
  source: WeightChangeDataSource | null

  // subscription for selector changes
  data: ReportsCriteria

  // refresh trigger
  refresh$ = new Subject<void>()

  constructor(
    private cdr: ChangeDetectorRef,
    private translator: TranslateService,
    private context: ContextService,
    private notifier: NotifierService,
    private database: StatisticsDatabase,
    private store: Store<ReportsState>
  ) {}

  ngOnInit() {
    this.source = new WeightChangeDataSource(
      this.notifier,
      this.database,
      this.translator,
      this.paginator,
      this.sort
    )

    this.source.addRequired(this.refresh$, () => ({
      organization: this.data ? this.data.organization : null,
      startDate: this.data
        ? moment(this.data.startDate).format('YYYY-MM-DD')
        : null,
      endDate: this.data ? moment(this.data.endDate).format('YYYY-MM-DD') : null
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

  downloadCSV() {
    const criteria = this.source.args
    criteria.limit = 'all'
    criteria.offset = 0
    void this.database.fetchWeightChange(criteria).then((res) => {
      if (!res.data.length) {
        return this.notifier.error(_('NOTIFY.ERROR.NOTHING_TO_EXPORT'))
      }
      const filename = `Patient_Weight_Change_${criteria.startDate}_${criteria.endDate}.csv`
      let csv = 'WEIGHT CHANGE REPORT\r\n'
      const pref = this.context.user.measurementPreference

      const data = res.data.map((d) => ({
        ID: d.account.id,
        'First Name': d.account.firstName,
        'Last Name': d.account.lastName,
        'Start Weight':
          unitConversion(pref, 'composition', d.change.startWeight, 2) +
          ' ' +
          this.source.i18n[
            unitLabel(pref, 'composition', d.change.startWeight)
          ],
        'End Weight':
          unitConversion(pref, 'composition', d.change.endWeight, 2) +
          ' ' +
          this.source.i18n[unitLabel(pref, 'composition', d.change.endWeight)],
        'Change Value':
          unitConversion(pref, 'composition', d.change.value, 2) +
          ' ' +
          this.source.i18n[unitLabel(pref, 'composition', d.change.value)],
        'Change Percentage': d.change.percentage,
        'Organization ID': d.organization.id,
        Organization: d.organization.name
      }))

      csv += Papa.unparse(data)

      CSV.toFile({ content: csv, filename })
    })
  }
}
